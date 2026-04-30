import List "mo:core/List";
import ReminderTypes "../types/reminder";
import Common "../types/common";

module {
  public type Reminder = ReminderTypes.Reminder;
  public type ReminderId = Common.ReminderId;
  public type ProductId = Common.ProductId;
  public type Timestamp = Common.Timestamp;

  public func add(
    reminders : List.List<Reminder>,
    productId : ProductId,
    alertHours : Int,
    nowMs : Timestamp,
    counter : Common.Counter,
  ) : Reminder {
    let id = "r" # counter.value.toText();
    counter.value += 1;
    let reminder : Reminder = {
      id;
      productId;
      alertHours;
      createdAt = nowMs;
    };
    reminders.add(reminder);
    reminder
  };

  public func getAll(reminders : List.List<Reminder>) : [Reminder] {
    reminders.toArray()
  };

  public func delete(reminders : List.List<Reminder>, id : ReminderId) : Bool {
    let found = reminders.findIndex(func(r) { r.id == id });
    switch (found) {
      case null { false };
      case (?idx) {
        let before = reminders.sliceToArray(0, idx);
        let after = reminders.sliceToArray(idx + 1, reminders.size().toInt());
        reminders.clear();
        for (r in before.values()) { reminders.add(r) };
        for (r in after.values()) { reminders.add(r) };
        true
      };
    }
  };
};
