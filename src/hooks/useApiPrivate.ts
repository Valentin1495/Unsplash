import { useEffect, useState } from 'react';
import useRefreshToken from './useRefreshToken';
import { api } from '../api/NFTeamApi';
import { AxiosError } from 'axios';

const useApiPrivate = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [newAccessToken, setNewAccessToken] = useState();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers['authorization']) {
          config.headers['authorization'] = accessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const prevReq = error.config;
        if (error.response?.status === 403 && prevReq) {
          useRefreshToken().then((data) => setNewAccessToken(data));

          if (newAccessToken) {
            prevReq.headers['authorization'] = newAccessToken;
          }

          return api(prevReq);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);

  return api;
};

export default useApiPrivate;
