import { PackType } from "../types/pack";

export const priceCalculateQuery = (query: PackType) => {
  try {
    const totalRoomPrice = query.hotelMeal.reduce(
      (total, current) =>
        Math.round(
          total +
            (current?.totalAdultPrice > 0 ? current?.totalAdultPrice : 0) +
            (current?.totalChildPrice > 0 ? current?.totalChildPrice : 0) +
            (current?.totalExtraAdultPrice > 0
              ? current?.totalExtraAdultPrice
              : 0) +
            (current?.gstAdultPrice > 0 ? current?.gstAdultPrice : 0) +
            (current?.gstChildPrice > 0 ? current?.gstChildPrice : 0) +
            (current?.gstExtraAdultPrice > 0 ? current?.gstExtraAdultPrice : 0),
        ),
      0,
    );

    const totalAdditionalFee = query.totalAdditionalFee;

    const totalTransportFee = query.totalTransportFee;
    const totalVehiclePrice = query.vehicleDetail.reduce(
      (total, current) => Math.round(total + current.price),
      0,
    );

    const totalActivityPrice = query.activity
      .map((item) =>
        item.event.reduce(
          (total, current) =>
            Math.round(total + (current?.price ? current.price : 0)),
          0,
        ),
      )
      .reduce((total, current) => Math.round(total + current));

    const totalCalculationPrice = Math.round(
      totalRoomPrice +
        totalAdditionalFee +
        totalTransportFee +
        query.marketingPer +
        totalVehiclePrice +
        totalActivityPrice,
    );

    const agentAmount = Math.round(
      totalCalculationPrice * (query.agentCommissionPer / 100),
    );
    const totalPackagePrice = Math.round(totalCalculationPrice + agentAmount);
    const gstPrice = Math.round(totalPackagePrice * (query.gstPer / 100));
    const finalPackagePrice = Math.round(gstPrice + totalPackagePrice);
    const perPerson = Math.round(totalPackagePrice / query.totalAdultCount);

    return {
      totalRoomPrice,
      totalAdditionalFee,
      totalTransportFee,
      totalVehiclePrice,
      totalActivityPrice,
      totalCalculationPrice,
      agentAmount,
      totalPackagePrice,
      gstPrice,
      finalPackagePrice,
      perPerson,
    };
  } catch (error: any) {
    // Error calculating price
  }
};
