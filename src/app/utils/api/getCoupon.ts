import api from './auth';
import toast from 'react-hot-toast';

export const getCoupon = async (coupon: string) => {
  const body = {
    couponCode: coupon,
  };
  try {
    const response = await api.post('package/coupon/check', body);
    return Promise.resolve(response?.data);
  } catch (error) {
    console.log(error);
    toast.error('Invalid Coupon');
    return Promise.reject('error');
  }
};
