import { prisma } from "../../prisma/client.js";

// ✅ إنشاء إشعار جديد
export const createNotification = async (userId, message, type = "GENERAL") => {
  return await prisma.notification.create({
    data: {
      userId,
      message,
      type,
    },
  });
};

// ✅ جلب كل الإشعارات للمستخدم الحالي
export const getNotificationsForUser = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// ✅ تحديث الإشعار (تحديده كمقروء)
export const markNotificationAsRead = async (id, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== userId) {
    throw new Error("Notification not found or not authorized");
  }

  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};
