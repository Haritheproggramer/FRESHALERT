import Common "common";

module {
  public type ProductId = Common.ProductId;
  public type Timestamp = Common.Timestamp;

  public type Product = {
    id : ProductId;
    name : Text;
    category : Text; // Food | Medicine | Daily
    location : Text;
    expiryDate : Timestamp;
    openedDate : ?Timestamp;
    photo : ?Text;
    notes : ?Text;
    status : Text; // safe | soon | expired
    createdAt : Timestamp;
  };

  public type CreateProductArgs = {
    name : Text;
    category : Text;
    location : Text;
    expiryDate : Timestamp;
    openedDate : ?Timestamp;
    photo : ?Text;
    notes : ?Text;
  };

  public type UpdateProductArgs = {
    id : ProductId;
    name : Text;
    category : Text;
    location : Text;
    expiryDate : Timestamp;
    openedDate : ?Timestamp;
    photo : ?Text;
    notes : ?Text;
  };
};
