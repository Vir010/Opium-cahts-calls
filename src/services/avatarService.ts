import { launchImageLibrary } from 'react-native-image-picker';

export interface UploadedAvatar {
  uri: string;
  fileName?: string;
  type?: string;
}

export const pickAvatarFromLibrary = async (): Promise<UploadedAvatar | null> => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 500,
      maxWidth: 500,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    if (!asset.uri) {
      return null;
    }

    return {
      uri: asset.uri,
      fileName: asset.fileName,
      type: asset.type,
    };
  } catch (error) {
    console.error('[avatarService] Ошибка при выборе изображения:', error);
    return null;
  }
};
