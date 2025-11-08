// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useToast } from '@/components/ui';
// @ts-ignore;
import { Lock, User, Eye, EyeOff } from 'lucide-react';

import { useForm } from 'react-hook-form';
export default function LoginPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });
  const onSubmit = async data => {
    setLoading(true);
    try {
      // 模拟登录验证
      if (data.username === 'admin' && data.password === 'admin123') {
        toast({
          title: "登录成功",
          description: "欢迎回来，管理员"
        });
        $w.utils.navigateTo({
          pageId: 'dashboard',
          params: {}
        });
      } else {
        toast({
          title: "登录失败",
          description: "用户名或密码错误",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                管理后台登录
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                请输入您的管理员账号信息
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">登录</CardTitle>
                <CardDescription className="text-center">
                  输入用户名和密码以访问管理后台
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="username" rules={{
                required: '请输入用户名'
              }} render={({
                field
              }) => <FormItem>
                          <FormLabel>用户名</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              <Input placeholder="请输入用户名" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="password" rules={{
                required: '请输入密码'
              }} render={({
                field
              }) => <FormItem>
                          <FormLabel>密码</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              <Input type={showPassword ? 'text' : 'password'} placeholder="请输入密码" className="pl-10 pr-10" {...field} />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? '登录中...' : '登录'}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>测试账号：admin / admin123</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>;
}