'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id as string);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } 
  };

  return (
    // <Card className="card-bordered ">
    //   <CardHeader>
    //     <div className="flex justify-between items-center">
    //       <CardTitle>{message.content}</CardTitle>
    //       <AlertDialog>
    //         <AlertDialogTrigger asChild>
    //           <Button variant='destructive'>
    //             <X className="w-5 h-5" />
    //           </Button>
    //         </AlertDialogTrigger>
    //         <AlertDialogContent>
    //           <AlertDialogHeader>
    //             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    //             <AlertDialogDescription>
    //               This action cannot be undone. This will permanently delete
    //               this message.
    //             </AlertDialogDescription>
    //           </AlertDialogHeader>
    //           <AlertDialogFooter>
    //             <AlertDialogCancel>
    //               Cancel
    //             </AlertDialogCancel>
    //             <AlertDialogAction onClick={handleDeleteConfirm}>
    //               Continue
    //             </AlertDialogAction>
    //           </AlertDialogFooter>
    //         </AlertDialogContent>
    //       </AlertDialog>
    //     </div>
    //     <div className="text-sm">
    //       {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
    //     </div>
    //   </CardHeader>
    //   <CardContent></CardContent>
    // </Card>
    <Card className="border border-blue-100 rounded-lg shadow-md overflow-hidden bg-slate-100 ">
    <CardHeader className="p-4 border-b border-blue-200">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold ">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="p-2 ">
              <X className="w-5 h-5 " />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-lg shadow-lg">
            <AlertDialogHeader className="p-4">
              <AlertDialogTitle className="text-lg font-semibold">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="p-4 flex justify-end gap-2">
              <AlertDialogCancel className="bg-gray-200 text-gray-700 rounded-md px-4 py-2">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 text-white rounded-md px-4 py-2">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="text-sm text-gray-500 mt-1">
        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
      </div>
    </CardHeader>
    <CardContent className="p-4">
      {/* Additional content can go here */}
    </CardContent>
  </Card>
  

  );
}