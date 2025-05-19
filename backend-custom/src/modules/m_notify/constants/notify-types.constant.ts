/**
 * Notification types constants
 */
export enum NotificationType {
  NEW_FOLLOWER = 'new_follower',
  NEW_POST_FROM_FOLLOWING = 'new_post_from_following',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  POST_SHARE = 'post_share',
  COMMENT_REPLY = 'comment_reply',
  GROUP_INVITATION = 'group_invitation',

  // Mini blog notifications
  MINI_BLOG_LIKE = 'mini_blog_like',
  MINI_BLOG_COMMENT = 'mini_blog_comment',
  MINI_BLOG_COMMENT_REPLY = 'mini_blog_comment_reply',
  MINI_BLOG_COMMENT_LIKE = 'mini_blog_comment_like',
  MINI_BLOG_SHARE = 'mini_blog_share',
  NEW_MINI_BLOG_FROM_FOLLOWING = 'new_mini_blog_from_following',
}
