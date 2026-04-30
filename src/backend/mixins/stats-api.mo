import List "mo:core/List";
import StatsLib "../lib/stats";
import ProductTypes "../types/product";

mixin (products : List.List<ProductTypes.Product>) {

  public query func getTotalProducts() : async Nat {
    StatsLib.getTotal(products)
  };

  public query func getExpiredCount() : async Nat {
    StatsLib.getExpiredCount(products)
  };

  public query func getSoonCount() : async Nat {
    StatsLib.getSoonCount(products)
  };

  public query func getFreshCount() : async Nat {
    StatsLib.getFreshCount(products)
  };

  public query func getWasteSaved() : async Float {
    StatsLib.getWasteSaved(products)
  };
};
