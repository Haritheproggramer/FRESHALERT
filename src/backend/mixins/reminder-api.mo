import List "mo:core/List";
import Time "mo:core/Time";
import ReminderLib "../lib/reminder";
import ReminderTypes "../types/reminder";
import Common "../types/common";

mixin (reminders : List.List<ReminderTypes.Reminder>, reminderCounter : Common.Counter) {

  public func addReminder(productId : Common.ProductId, alertHours : Int) : async ReminderTypes.Reminder {
    let nowMs = Time.now() / 1_000_000;
    ReminderLib.add(reminders, productId, alertHours, nowMs, reminderCounter)
  };

  public query func getReminders() : async [ReminderTypes.Reminder] {
    ReminderLib.getAll(reminders)
  };

  public func deleteReminder(id : Common.ReminderId) : async Bool {
    ReminderLib.delete(reminders, id)
  };
};
