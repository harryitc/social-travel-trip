// 'use client';

// import { useEffect } from 'react';
// import { useWebSocket } from '@/lib/providers/websocket.provider';
// import { WebsocketEvent } from '@/lib/services/websocket.service';
// import { useRouter } from 'next/navigation';
// import { notification } from 'antd';

// /**
//  * Component that listens for WebSocket notifications and displays them
//  */
// export const NotificationListener = () => {
//   const { on, off, isConnected } = useWebSocket();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isConnected) return;

//     // Handler for new post notifications
//     const handlePostCreated = (data: any) => {
//       notification.info({
//         message: 'Bài viết mới',
//         description: `${data.authorName || 'Một người dùng'} vừa đăng một bài viết mới`,
//         placement: 'topRight',
//         onClick: () => router.push(`/post/${data.post.post_id}`),
//       });
//     };

//     // Handler for post liked notifications
//     const handlePostLiked = (data: any) => {
//       notification.info({
//         message: 'Lượt thích mới',
//         description: `${data.likerData.username || 'Một người dùng'} vừa thích bài viết của bạn`,
//         placement: 'topRight',
//         onClick: () => router.push(`/post/${data.postId}`),
//       });
//     };

//     // Handler for new comment notifications
//     const handleCommentCreated = (data: any) => {
//       notification.info({
//         message: 'Bình luận mới',
//         description: `${data.commenterData.username || 'Một người dùng'} vừa bình luận về bài viết của bạn`,
//         placement: 'topRight',
//         onClick: () => router.push(`/post/${data.postId}`),
//       });
//     };

//     // Handler for new follower notifications
//     const handleUserFollowed = (data: any) => {
//       notification.info({
//         message: 'Người theo dõi mới',
//         description: `${data.followerData.username || 'Một người dùng'} vừa bắt đầu theo dõi bạn`,
//         placement: 'topRight',
//         onClick: () => router.push(`/profile/${data.followerId}`),
//       });
//     };

//     // Register event handlers
//     on(WebsocketEvent.POST_CREATED, handlePostCreated);
//     on(WebsocketEvent.POST_LIKED, handlePostLiked);
//     on(WebsocketEvent.COMMENT_CREATED, handleCommentCreated);
//     on(WebsocketEvent.USER_FOLLOWED, handleUserFollowed);

//     // Cleanup function
//     return () => {
//       off(WebsocketEvent.POST_CREATED, handlePostCreated);
//       off(WebsocketEvent.POST_LIKED, handlePostLiked);
//       off(WebsocketEvent.COMMENT_CREATED, handleCommentCreated);
//       off(WebsocketEvent.USER_FOLLOWED, handleUserFollowed);
//     };
//   }, [isConnected, notification, router, on, off]);

//   // This component doesn't render anything
//   return null;
// };
