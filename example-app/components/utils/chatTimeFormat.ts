import { TFunction } from "i18next";

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}

export function shouldShowTimeSeparator(
  currentMessage: { createdAt: number },
  previousMessage?: { createdAt: number }
): boolean {
  if (!previousMessage) return true;
  return !isSameDay(new Date(currentMessage.createdAt), new Date(previousMessage.createdAt));
}

export function formatTimeSeparator(timestamp: number, t: TFunction): string {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (isSameDay(messageDate, today)) {
    return t('time.today');
  }
  
  if (isSameDay(messageDate, yesterday)) {
    return t('time.yesterday');
  }
  
  if (isSameDay(messageDate, tomorrow)) {
    return t('time.tomorrow');
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (messageDate.getFullYear() === today.getFullYear()) {
    return `${months[messageDate.getMonth()]} ${messageDate.getDate()}`;
  }
  
  return `${months[messageDate.getMonth()]} ${messageDate.getDate()}, ${messageDate.getFullYear()}`;
}