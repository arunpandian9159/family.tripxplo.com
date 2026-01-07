import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import OtpInput, { OTPInputProps } from 'react-otp-input';

type OtpOptions = Omit<OTPInputProps, 'renderInput'>;

type OtpStyledInputProps = {
  className?: string;
} & OtpOptions;

export const OtpStyledInput = forwardRef<HTMLInputElement, OtpStyledInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <OtpInput
        {...props}
        numInputs={6} // Specify the number of OTP input fields
        renderInput={(inputProps, index) => (
          <Input
            {...inputProps}
            className={cn('w-10 appearance-none selection:bg-none text-center text-sm', className)}
            key={index} // Ensure each input has a unique key
            ref={ref} // Forward the ref to the input
          />
        )}
        containerStyle={`flex justify-center items-center gap-2 text-sm font-medium`}
      />
    );
  }
);

OtpStyledInput.displayName = 'OtpStyledInput';
