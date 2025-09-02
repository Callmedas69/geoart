"use client";

import { AvatarComponent } from '@rainbow-me/rainbowkit';
import { useBasename } from '@/basenames/hooks/useBasename';
import { generateColorFromAddress } from '@/utils/avatar';

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const basenameQuery = useBasename(address as `0x${string}`);
  const basenameAvatar = basenameQuery.data?.avatar;
  
  // Priority: basename avatar > ENS image > fallback
  const avatarSrc = basenameAvatar || ensImage;
  const color = generateColorFromAddress(address);

  return avatarSrc ? (
    <img
      src={avatarSrc}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
      alt="Avatar"
    />
  ) : (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 999,
        height: size,
        width: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        color: 'white',
        fontWeight: 'bold',
      }}
    >
      {address.slice(2, 4).toUpperCase()}
    </div>
  );
};