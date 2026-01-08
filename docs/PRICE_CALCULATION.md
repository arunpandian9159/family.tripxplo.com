# Price Calculation System Documentation

## Overview

The TripXplo package pricing system calculates the total cost of a travel package based on hotels, vehicles, activities, and various fees. This document explains the calculation logic and API endpoints.

---

## Price Calculation Formula

```
totalCalculationPrice = totalRoomPrice + totalAdditionalFee + totalTransportFee
                        + marketingPer + totalVehiclePrice + totalActivityPrice

agentAmount = totalCalculationPrice × (agentCommissionPer / 100)
totalPackagePrice = totalCalculationPrice + agentAmount
gstPrice = totalPackagePrice × (gstPer / 100)
finalPackagePrice = totalPackagePrice + gstPrice
perPerson = totalPackagePrice / totalAdultCount
```

---

## Component Breakdowns

### 1. Room Pricing (`totalRoomPrice`)

Each hotel stay's room price is calculated from meal plan details:

```
totalAdultPrice = roomPrice × noRoomCount × noOfNight
gstAdultPrice = totalAdultPrice × (gstPer / 100)

totalChildPrice = childPrice × noOfChild × noOfNight
gstChildPrice = totalChildPrice × (gstPer / 100)

totalExtraAdultPrice = adultPrice × noExtraAdult × noOfNight
gstExtraAdultPrice = totalExtraAdultPrice × (gstPer / 100)
```

**Total Room Price** = Sum of all hotels' (totalAdultPrice + gstAdultPrice + totalChildPrice + gstChildPrice + totalExtraAdultPrice + gstExtraAdultPrice)

### 2. Vehicle Pricing (`totalVehiclePrice`)

Sum of all vehicles' individual `price` field.

### 3. Activity Pricing (`totalActivityPrice`)

Sum of all activity events' `price` fields.

### 4. Additional Fees

- `totalAdditionalFee`: Pre-calculated additional fees
- `totalTransportFee`: Pre-calculated transport fees (per-person × total guests)
- `marketingPer`: Fixed marketing fee

---

## API Endpoints

### POST `/api/v1/packages/price/quote`

Calculates package price given package data.

**Request Body:**

```json
{
  "package": {
    "hotelMeal": [...],
    "vehicleDetail": [...],
    "activity": [...],
    "totalTransportFee": 4800,
    "totalAdditionalFee": 0,
    "marketingPer": 500,
    "agentCommissionPer": 12,
    "gstPer": 5,
    "totalAdultCount": 2
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRoomPrice": 8400,
    "totalAdditionalFee": 0,
    "totalTransportFee": 4800,
    "totalVehiclePrice": 8000,
    "totalActivityPrice": 0,
    "totalCalculationPrice": 21700,
    "AgentAmount": 2604,
    "totalPackagePrice": 24304,
    "gstPrice": 1215,
    "finalPackagePrice": 25519,
    "perPerson": 12152
  }
}
```

### GET `/api/v1/rooms/[roomId]/meals`

Returns available meal plans with calculated prices for a room.

**Query Parameters:**
| Param | Description | Default |
|-------|------------|---------|
| `startDate` | Travel start date | - |
| `noOfNight` | Number of nights | 1 |
| `noOfChild` | Number of children | 0 |
| `noRoomCount` | Number of rooms | 1 |
| `noExtraAdult` | Extra adults | 0 |

---

## Key Files

| File                                       | Purpose                                |
| ------------------------------------------ | -------------------------------------- |
| `app/api/v1/packages/price/quote/route.ts` | Price quote API                        |
| `app/api/v1/rooms/[roomId]/meals/route.ts` | Room meal plans with prices            |
| `app/store/features/packageSlice.ts`       | Redux state & price calculation thunks |
| `app/utils/priceCalculator.ts`             | Client-side price utility (legacy)     |

---

## Important Notes

1. **Use pre-calculated totals**: The quote API prioritizes `totalTransportFee` over `transPer`, `totalAdditionalFee` over `additionalFees`
2. **GST is applied on agent-inclusive price**: GST is calculated on `totalPackagePrice` (after agent commission)
3. **Per-person excludes GST**: `perPerson` is calculated from `totalPackagePrice`, not `finalPackagePrice`
