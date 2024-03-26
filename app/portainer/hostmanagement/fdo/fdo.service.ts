import axios, { parseAxiosError } from '@/portainer/services/axios';

import { FDOConfiguration, DeviceConfiguration, Profile } from './model';

const BASE_URL = '/fdo';

export async function configureFDO(formValues: FDOConfiguration) {
  try {
    await axios.post(`${BASE_URL}/configure`, formValues);
  } catch (e) {
    throw parseAxiosError(e as Error, '无法配置FDO');
  }
}

export async function configureDevice(
  deviceId: string,
  deviceConfig: DeviceConfiguration
) {
  try {
    await axios.post(`${BASE_URL}/configure/${deviceId}`, deviceConfig);
  } catch (e) {
    throw parseAxiosError(e as Error, '无法配置设备');
  }
}

export async function createProfile(
  name: string,
  method: string,
  profileFileContent: string
) {
  const payload = {
    name,
    profileFileContent,
  };
  try {
    await axios.post(`${BASE_URL}/profiles`, payload, {
      params: { method },
    });
  } catch (e) {
    throw parseAxiosError(e as Error, '无法创建配置文件');
  }
}

export async function getProfiles() {
  try {
    const { data: profiles } = await axios.get<Profile[]>(
      `${BASE_URL}/profiles`
    );
    return profiles;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取配置文件');
  }
}

export async function getProfile(profileId: number) {
  try {
    const { data: profile } = await axios.get<Profile>(
      `${BASE_URL}/profiles/${profileId}`
    );
    return profile;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法获取配置文件');
  }
}

export async function deleteProfile(profileId: number) {
  try {
    await axios.delete(`${BASE_URL}/profiles/${profileId}`);
  } catch (e) {
    throw parseAxiosError(e as Error, '无法删除配置文件');
  }
}

export async function updateProfile(
  id: number,
  name: string,
  profileFileContent: string
) {
  const payload = {
    name,
    profileFileContent,
  };
  try {
    await axios.put(`${BASE_URL}/profiles/${id}`, payload);
  } catch (e) {
    throw parseAxiosError(e as Error, '无法更新配置文件');
  }
}

export async function duplicateProfile(id: number) {
  try {
    const { data: profile } = await axios.post<Profile>(
      `${BASE_URL}/profiles/${id}/duplicate`
    );
    return profile;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法复制配置文件');
  }
}
