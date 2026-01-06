export interface FamilyType {
  name: string;
  adults: number;
  children611: number;
  children25: number;
  infants: number;
  total: number;
}

export const familyTypes: FamilyType[] = [
  {
    name: 'Baby Bliss - 2 Adults + 1 Infant (Below 2 yrs)',
    adults: 2,
    children611: 0,
    children25: 0,
    infants: 1,
    total: 3,
  },
  {
    name: 'Cosmic Combo - 2 Adults + 1 Child (Below 5 yrs) + 1 Teenager (Above 11 yrs)',
    adults: 3,
    children611: 0,
    children25: 1,
    infants: 0,
    total: 4,
  },
  {
    name: 'Cosmic Combo Duo - 2 Adults + 1 Children (Above 5 yrs) + 1 Teenager (Above 11 yrs)',
    adults: 3,
    children611: 1,
    children25: 0,
    infants: 0,
    total: 4,
  },
  {
    name: 'Cosmic Duo+ - 2 Adults + 1 Extra Adult (Above 11 yrs)',
    adults: 3,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 3,
  },
  {
    name: 'Cosmic Grand Combo - 2 Adults + 1 Child (Below 5 yrs) + 1 Teenager (Above 11 yrs) + 2 Grandparents',
    adults: 5,
    children611: 0,
    children25: 1,
    infants: 0,
    total: 6,
  },
  { name: 'Duo - 2 Adults', adults: 2, children611: 0, children25: 0, infants: 0, total: 2 },
  {
    name: 'Dynamic Cosmic Duo - 5 Adults',
    adults: 5,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 5,
  },
  {
    name: 'Dynamic Cosmic Duo+ - 5 Adults + 1 Extra Adult (Above 11 yrs)',
    adults: 6,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 6,
  },
  {
    name: 'Dynamic Family Duo+ - 2 Adults + 2 Teenagers (Above 11 yrs)',
    adults: 4,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 4,
  },
  {
    name: 'Dynamic Grand Duo+ 2 Adults + 2 Teenagers (Above 11 yrs) + 2 Grandparents',
    adults: 6,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 6,
  },
  {
    name: 'Extended Cosmic Duo+ - 2 Adults + 2 Extra Adult (Above 11 yrs)',
    adults: 4,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 4,
  },
  {
    name: 'Family Nest - 2 Adults + 2 Child (Below 5 yrs)',
    adults: 2,
    children611: 0,
    children25: 2,
    infants: 0,
    total: 4,
  },
  {
    name: 'Fantastic Four - 2 Adults + 2 Children (5 yrs to 11 yrs)',
    adults: 2,
    children611: 2,
    children25: 0,
    infants: 0,
    total: 4,
  },
  {
    name: 'Grand Bliss - 2 Adults + 1 Infant (Below 2 yrs) + 2 Grandparents',
    adults: 4,
    children611: 0,
    children25: 0,
    infants: 1,
    total: 5,
  },
  {
    name: 'Grand Delight - 2 Adults + 1 Child (Below 5 yrs) + 2 Grandparents',
    adults: 4,
    children611: 0,
    children25: 1,
    infants: 0,
    total: 5,
  },
  {
    name: 'Grand Family Nest - 2 Adults + 2 Child (Below 5 yrs) + 2 Grandparents',
    adults: 4,
    children611: 0,
    children25: 2,
    infants: 0,
    total: 6,
  },
  {
    name: 'Grand Fantastic Four - 2 Adults + 2 Children (5 yrs to 11 yrs) + 2 Grandparents',
    adults: 4,
    children611: 2,
    children25: 0,
    infants: 0,
    total: 6,
  },
  {
    name: 'Grand Mix Match Clan - 2 Adults + 3 Children (Mix of age groups) + 2 Grandparents',
    adults: 4,
    children611: 1,
    children25: 2,
    infants: 0,
    total: 7,
  },
  {
    name: 'Grand Nebula - 2 Adults + 1 Child (5 yrs to 11 yrs) + 2 Grandparents',
    adults: 4,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 4,
  },
  {
    name: 'Grandparent Plus One - 1 Adult + 2 Children (Below 5 yrs) + 2 Grandparents',
    adults: 3,
    children611: 0,
    children25: 2,
    infants: 0,
    total: 5,
  },
  {
    name: 'Mix Match Clan - 2 Adults + 3 Children (Mix of age groups)',
    adults: 2,
    children611: 1,
    children25: 2,
    infants: 0,
    total: 5,
  },
  {
    name: 'Nebula Nest - 2 Adults + 1 Children (5 yrs to 11 yrs)',
    adults: 2,
    children611: 1,
    children25: 0,
    infants: 0,
    total: 3,
  },
  {
    name: 'Orbiting Duo - 1 Adult + 1 Child (Below 5 yrs)',
    adults: 1,
    children611: 0,
    children25: 1,
    infants: 0,
    total: 2,
  },
  {
    name: 'Orbiting Duo+ - 1 Adult + 1 Children (5 yrs to 11 yrs)',
    adults: 1,
    children611: 1,
    children25: 0,
    infants: 0,
    total: 2,
  },
  {
    name: 'Orbiting Grand Duo+ - 1 Adult + 1 Children (5 yrs to 11 yrs) + 2 Grandparents',
    adults: 3,
    children611: 1,
    children25: 0,
    infants: 0,
    total: 4,
  },
  {
    name: 'Orbiting Grand Duo - 1 Adult + (Below 5 yrs) + 2 Grandparents',
    adults: 3,
    children611: 0,
    children25: 1,
    infants: 0,
    total: 4,
  },
  {
    name: 'Parent Plus Two - 1 Adult + 2 Children (Below 5 yrs)',
    adults: 2,
    children611: 0,
    children25: 2,
    infants: 0,
    total: 4,
  },
  {
    name: 'Stellar Duo - 2 Adults + 1 Child (2 to 5 yrs) + 1 Children (5 to 11 yrs)',
    adults: 2,
    children611: 1,
    children25: 1,
    infants: 0,
    total: 4,
  },
  {
    name: 'Stellar Grand Duo - 2 Adults + 1 Child (2 to 5 yrs) + 1 Children (5 to 11 yrs) + 2 Grandparents',
    adults: 4,
    children611: 1,
    children25: 1,
    infants: 0,
    total: 6,
  },
  {
    name: 'Stellar Teen Duo - 2 Adults + 1 Child (2 to 5 yrs) + 1 Children (5 to 11 yrs) + 1 Teenager (Above 11 yrs)',
    adults: 3,
    children611: 1,
    children25: 1,
    infants: 0,
    total: 5,
  },
  {
    name: 'Stellar Teen Duo Grand - 2 Adults + 1 Child (2 to 5 yrs) + 1 Children (5 to 11 yrs) + 1 Teenager (Above 11 yrs) + 2 Grandparents',
    adults: 5,
    children611: 1,
    children25: 1,
    infants: 0,
    total: 7,
  },
  {
    name: 'Teen Trek - 2 Adults + 1 Teenager (Above 11 yrs)',
    adults: 3,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 3,
  },
  {
    name: 'Teen Trek with Grand - 2 Adults + 1 Teenager (Above 11 yrs) + 2 Grandparents',
    adults: 5,
    children611: 0,
    children25: 0,
    infants: 0,
    total: 5,
  },
  {
    name: 'Tiny Delight - 2 Adults + 1 Child (Below 5 yrs)',
    adults: 2,
    children611: 0,
    children25: 1,
    infants: 0,
    total: 3,
  },
];

// Default family type when no match is found
export const defaultFamilyType: FamilyType = {
  name: 'Dynamic Family Duo+ - 2 Adults + 2 Teenagers (Above 11 yrs)',
  adults: 4,
  children611: 0,
  children25: 0,
  infants: 0,
  total: 4,
};

// Function to detect family type based on guest selection
export function detectFamilyType(
  adults: number,
  children611: number,
  children25: number,
  infants: number
): FamilyType {
  return (
    familyTypes.find(
      ft =>
        ft.adults === adults &&
        ft.children611 === children611 &&
        ft.children25 === children25 &&
        ft.infants === infants
    ) || defaultFamilyType
  );
}
