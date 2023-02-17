import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import BannerCol from './BannerCol';
import { getHomeCol } from '../../api/NFTeamApi';
import BannerSkeleton from '../Skeleton/BannerSkeleton';

export interface ColInfo {
  collectionId: number | undefined;
  collectionName: string | undefined;
  logoImgName: string | undefined;
}

export default function Banner() {
  const [banner, setBanner] = useState<ColInfo>();
  const { isLoading } = useQuery<ColInfo[]>({
    queryKey: ['mainCollection'],
    queryFn: () => getHomeCol(1, 12),
    onSuccess: (data) =>
      setBanner(data[Math.floor(Math.random() * data.length)]),
  });

  if (isLoading) return <BannerSkeleton />;

  return (
    <div className='overflow-hidden w-full h-[500px]'>
      <BannerCol
        key={banner?.collectionId}
        collectionId={banner?.collectionId}
        collectionName={banner?.collectionName}
        logoImgName={banner?.logoImgName}
      />
    </div>
  );
}
