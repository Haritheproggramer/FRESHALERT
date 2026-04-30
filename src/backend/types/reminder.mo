import Common "common";

module {
  public type ReminderId = Common.ReminderId;
  public type ProductId = Common.ProductId;
  public type Timestamp = Common.Timestamp;

  public type Reminder = {
    id : ReminderId;
    productId : ProductId;
    alertHours : Int;
    createdAt : Timestamp;
  };
};
