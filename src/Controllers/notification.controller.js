import {
  getNotificationsForUser,
  markNotificationAsRead,
  createNotification,
} from "../Services/notification.services.js";

// ✅ جلب كل الإشعارات للمستخدم الحالي
export const fetchNotifications = async (req, res) => {
  const userId = req.user.id; // المفروض الـ token فيه id المستخدم
  const notifications = await getNotificationsForUser(userId);

  res.status(200).json({
    message: "Notifications fetched successfully ✅",
    data: notifications,
  });
};

// ✅ تحديث الإشعار كمقروء
export const readNotification = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const notification = await markNotificationAsRead(Number(id), userId);

  res.status(200).json({
    message: "Notification marked as read ✅",
    data: notification,
  });
};
