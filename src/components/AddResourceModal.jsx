// @ts-ignore;
import React, { useState, useRef } from 'react';
// @ts-ignore;
import { Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useToast, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui';
// @ts-ignore;
import { Upload, X, Image as ImageIcon, FileText, Plus, Loader2 } from 'lucide-react';

import { useForm } from 'react-hook-form';
export function AddResourceModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
  $w
}) {
  const {
    toast
  } = useToast();
  const [uploading, setUploading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);
  const [detailImages, setDetailImages] = useState([]);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const detailInputRef = useRef(null);
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      file_type: '',
      file_size: 0
    }
  });
  const handleCoverUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({
        title: "文件类型错误",
        description: "请上传图片文件",
        variant: "destructive"
      });
      return;
    }
    setCoverImage(file);
    form.setValue('file_type', file.type.split('/')[1]);
  };
  const handleResourceUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;
    setResourceFile(file);
    form.setValue('file_size', file.size);
    form.setValue('file_type', file.name.split('.').pop());
  };
  const handleDetailImagesUpload = async event => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast({
        title: "文件类型错误",
        description: "只能上传图片文件",
        variant: "destructive"
      });
    }
    setDetailImages(prev => [...prev, ...validFiles]);
  };
  const removeDetailImage = index => {
    setDetailImages(prev => prev.filter((_, i) => i !== index));
  };
  const uploadToCloudStorage = async (file, path) => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const result = await tcb.uploadFile({
        cloudPath: path,
        filePath: file
      });
      return result.fileID;
    } catch (error) {
      console.error('云存储上传失败:', error);
      throw new Error('文件上传失败');
    }
  };
  const getTempFileURL = async fileID => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const result = await tcb.getTempFileURL({
        fileList: [fileID]
      });
      return result.fileList[0].tempFileURL;
    } catch (error) {
      console.error('获取文件链接失败:', error);
      return fileID; // 返回 fileID 作为备用
    }
  };
  const saveResourceToDatabase = async resourceData => {
    try {
      // 使用数据源API保存到resources数据模型
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'resources',
        methodName: 'wedaCreateV2',
        params: {
          data: resourceData
        }
      });
      return result.id;
    } catch (error) {
      console.error('保存资源数据失败:', error);
      throw new Error('保存资源数据失败');
    }
  };
  const onSubmit = async data => {
    if (!coverImage || !resourceFile) {
      toast({
        title: "上传失败",
        description: "请上传封面图片和资源文件",
        variant: "destructive"
      });
      return;
    }
    setUploading(true);
    try {
      // 获取分类名称用于云存储目录
      const selectedCategory = categories.find(cat => cat._id === data.category_id);
      const categoryName = selectedCategory?.name || 'uncategorized';
      const timestamp = Date.now();

      // 上传封面图片
      const coverPath = `${categoryName}/covers/${timestamp}_${coverImage.name}`;
      const coverFileID = await uploadToCloudStorage(coverImage, coverPath);
      const coverUrl = await getTempFileURL(coverFileID);

      // 上传资源文件
      const resourcePath = `${categoryName}/files/${timestamp}_${resourceFile.name}`;
      const resourceFileID = await uploadToCloudStorage(resourceFile, resourcePath);
      const resourceUrl = await getTempFileURL(resourceFileID);

      // 上传详情图片
      const detailUrls = [];
      const detailFileIDs = [];
      for (let i = 0; i < detailImages.length; i++) {
        const detailPath = `${categoryName}/details/${timestamp}_${i}_${detailImages[i].name}`;
        const detailFileID = await uploadToCloudStorage(detailImages[i], detailPath);
        const detailUrl = await getTempFileURL(detailFileID);
        detailUrls.push(detailUrl);
        detailFileIDs.push(detailFileID);
      }

      // 创建资源记录 - 匹配数据模型字段
      const resourceData = {
        title: data.title,
        description: data.description || '',
        category_id: data.category_id,
        cover_url: coverUrl,
        cover_file_id: coverFileID,
        file_url: resourceUrl,
        file_id: resourceFileID,
        detail_images: detailUrls,
        detail_file_ids: detailFileIDs,
        file_type: data.file_type,
        file_size: data.file_size,
        download_count: 0,
        favorite_count: 0,
        hot_score: 0,
        is_recommended: false,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 保存到数据库
      const resourceId = await saveResourceToDatabase(resourceData);
      console.log('资源保存成功，ID:', resourceId);
      toast({
        title: "添加成功",
        description: "资源已成功添加到数据库"
      });
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('添加资源失败:', error);
      toast({
        title: "添加失败",
        description: error.message || "添加资源时发生错误",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  const handleClose = () => {
    form.reset();
    setCoverImage(null);
    setResourceFile(null);
    setDetailImages([]);
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>添加新资源</DialogTitle>
          <DialogDescription>
            填写资源信息并上传相关文件
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">基本信息</h3>
              
              <FormField control={form.control} name="title" rules={{
              required: '请输入资源标题'
            }} render={({
              field
            }) => <FormItem>
                  <FormLabel>资源标题</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入资源标题" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <FormField control={form.control} name="description" render={({
              field
            }) => <FormItem>
                  <FormLabel>资源描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入资源描述" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <FormField control={form.control} name="category_id" rules={{
              required: '请选择分类'
            }} render={({
              field
            }) => <FormItem>
                  <FormLabel>资源分类</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>} />
            </div>

            {/* 封面图片上传 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">封面图片</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {coverImage ? <div className="space-y-4">
                    <div className="relative inline-block">
                      <img src={URL.createObjectURL(coverImage)} alt="封面" className="max-w-full h-48 object-cover rounded-lg" />
                      <button type="button" onClick={() => setCoverImage(null)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{coverImage.name}</p>
                  </div> : <div className="space-y-4">
                    <ImageIcon size={48} className="mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">点击上传封面图片</p>
                      <p className="text-sm text-gray-600">支持 JPG、PNG、GIF 格式</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()}>
                      <Upload size={16} className="mr-2" />
                      选择文件
                    </Button>
                  </div>}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </div>

            {/* 资源文件上传 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">资源文件</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {resourceFile ? <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <FileText size={48} className="text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium">{resourceFile.name}</p>
                        <p className="text-sm text-gray-600">{(resourceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={() => setResourceFile(null)} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  </div> : <div className="space-y-4">
                    <FileText size={48} className="mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">点击上传资源文件</p>
                      <p className="text-sm text-gray-600">支持 PDF、DOC、ZIP 等格式</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={16} className="mr-2" />
                      选择文件
                    </Button>
                  </div>}
              </div>
              <input ref={fileInputRef} type="file" onChange={handleResourceUpload} className="hidden" />
            </div>

            {/* 详情图片上传 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">详情图片</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <div className="space-y-4">
                  <ImageIcon size={48} className="mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">上传详情图片</p>
                    <p className="text-sm text-gray-600">支持多张图片，用于展示资源详情</p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => detailInputRef.current?.click()}>
                    <Plus size={16} className="mr-2" />
                    添加图片
                  </Button>
                </div>
              </div>
              <input ref={detailInputRef} type="file" accept="image/*" multiple onChange={handleDetailImagesUpload} className="hidden" />
              
              {/* 已上传的详情图片预览 */}
              {detailImages.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {detailImages.map((image, index) => <div key={index} className="relative group">
                      <img src={URL.createObjectURL(image)} alt={`详情${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeDetailImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={16} />
                      </button>
                    </div>)}
                </div>}
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={uploading}>
                取消
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? <><Loader2 size={16} className="mr-2 animate-spin" />上传中...</> : '添加资源'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
}