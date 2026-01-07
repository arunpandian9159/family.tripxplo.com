
export interface PackageType{
    AgentAmount:number,
    activity:Activity[],
    activityCount:number,
    agentCommissionPer:number,
    destination:Destination[]
    finalPackagePrice:number,
    gstPer:number,
    gstPrice:number,
    hotelCount:number,
    hotelMeal:HotelMeal[],
    isMark:boolean,
    marketingPer:number,
    noOfDays:number,
    noOfNight:number,
    packageId:string,
    packageImg:string[],
    packageName:string,
    perPerson:number,
    planName:string,
    startFrom:string,
    totalActivityPrice:number,
    totalAdditionalFee:number,
    totalCalculationPrice:number,
    totalPackagePrice:number,
    totalRoomPrice:number,
    totalTransportFee:number,
    totalVehiclePrice:number,
    vehicleCount:number
    }
    
    interface Activity{
        day:number,
    event:ActivityEvent[],
    from:string,
    startDateWise:number,
    to:string,
    _id:string
    }
   export  interface ActivityEvent{
    
    activityId:string,
    activityType:string,
    destinationId:string,
    image:string,
    name:string,
    slot:number,
    timePeriod:string,
    __v:number,
    _id:string
    }
   export interface Destination{
        destinationId:string,
    destinationName:string,
    destinationType:string,
    noOfNight:number,
    rankNo:number,
    __v:number,
    _id:string,
    }
   export  interface HotelMeal{
        adultPrice:number,
        childPrice:number,
        endDate:string[],
        endDateWise:number,
        gstAdultPrice:number,
        gstChildPrice:number,
        gstExtraAdultPrice:number,
        gstPer:number,
        hotelId:string,
        hotelMealId:string,
        hotelRoomId:string,
        hotelRoomType:string,
        isAc:boolean,
        isAddOn:boolean,
        maxAdult:number,
        maxChild:number,
        maxInf:number,
        mealPlan:string,
        noOfNight:number,
        roomCapacity:number,
        roomPrice:number,
        seasonType:string,
        sort:number,
        startDate:string[],
        startDateWise:number,
        totalAdultPrice:number,
        totalChildPrice:number,
        totalExtraAdultPrice:number,
        __v:number,
        _id:string,
    }
    