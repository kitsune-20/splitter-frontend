// app/tabs/_layout.tsx
import React, { useCallback, useEffect } from 'react';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Pressable, AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Text, View, Theme, Circle } from 'tamagui';
import { Bell, ChevronLeft, ScanLine, Users, Users2, Clock3, User } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

import { useAppStore } from '@/shared/lib/stores/app-store';
import UserAvatar from '@/shared/ui/UserAvatar';
import { useFriendsStore } from '@/features/friends/model/friends.store';


// --- DotBadge ---
function DotBadge({ value }: { value?: number }) {
  if (!value || value <= 0) return null;
  return (
    <View
      position="absolute"
      top={-4} right={-4}
      w={20} h={20}
      br={999}
      ai="center" jc="center"
      backgroundColor="#2ECC71"
    >
      <Text color="white" fontSize={10} fontWeight="700">
        {value}
      </Text>
    </View>
  );
}

// --- Global Header ---
function GlobalTabsHeader(props: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAppStore();
  const fetchAll = useFriendsStore((s) => s.fetchAll);
  const { t } = useTranslation();
  useEffect(() => { fetchAll(); }, [fetchAll]);
  useFocusEffect(useCallback(() => { fetchAll(); }, [fetchAll]));
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => { if (state === 'active') fetchAll(); });
    return () => sub.remove();
  }, [fetchAll]);

  const requestsCount = useFriendsStore((s) => s.requestsRaw?.incoming?.length ?? 0);
  const displayName = user?.username ?? '';
  const userInitial = displayName.slice(0, 1).toUpperCase();

  return (
    <YStack bg="$background" pt={insets.top}>
      <XStack h={50} ai="center" jc="space-between" px="$3">
        {/* Left spacer to keep title centered */}
        <XStack w={140} ai="center" jc="flex-start" px="$1">
          <XStack ai="center" jc="flex-start" w={120} />
        </XStack>

        {/* Center: title occupies remaining space and is centered */}
        <XStack flex={1} ai="center" jc="center" px="$2">
          <Text fontSize={18} fontWeight="600" numberOfLines={1} miw={150} textAlign="center">
            {props.options.title}
          </Text>
        </XStack>

        {/* Right: reserve width to avoid shift */}
        <XStack w={140} ai="center" jc="flex-end" gap="$2" px="$1">
          <Pressable onPress={() => router.push('/tabs/friends/requests')}>
            <View>
              <Bell size={22} color="$gray11" />
              <DotBadge value={requestsCount} />
            </View>
          </Pressable>
        </XStack>
      </XStack>
    </YStack>
  );
}

// --- Main Bottom Bar ---
function MainBottomBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (match: (path: string) => boolean) => {
    if (!pathname) return false;
    return match(pathname);
  };

  const goFriends = () => router.push('/tabs/friends');
  const goGroups = () => router.push('/tabs/groups');
  const goHistory = () => router.push('/tabs/sessions/history');
  const goScan = () => router.push('/tabs/scan-receipt');
  const goProfile = () => router.push('/tabs/profile');

  const NavButton = ({
    label,
    active,
    onPress,
    children,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
    children: React.ReactNode;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.85 : 1,
      })}
      hitSlop={10}
    >
      <YStack ai="center" gap="$1">
        <Circle
          size={34}
          bg={active ? '#2ECC71' : 'transparent'}
          borderWidth={active ? 0 : 1}
          borderColor={active ? 'transparent' : '#E4E7EB'}
          ai="center"
          jc="center"
        >
          {children}
        </Circle>
        <Text fontSize={11} color={active ? '#2ECC71' : '$gray11'}>
          {label}
        </Text>
      </YStack>
    </Pressable>
  );

  const scanActive = isActive((p) => p.startsWith('/tabs/scan-receipt') || p === '/tabs');
  const friendsActive = isActive((p) => p.startsWith('/tabs/friends'));
  const groupsActive = isActive((p) => p.startsWith('/tabs/groups'));
  const historyActive = isActive((p) => p.startsWith('/tabs/sessions/history'));
  const profileActive = isActive((p) => p.startsWith('/tabs/profile'));

  return (
    <YStack
      pb={Math.max(insets.bottom, 6)}
      pt="$1"
      px="$3"
      bg="rgba(255,255,255,0.96)"
      borderTopWidth={1}
      borderTopColor="#E4E7EB"
    >
      <XStack ai="center" jc="space-between" gap="$2">
        <NavButton label={t('home.actions.friends', 'Friends')} active={friendsActive} onPress={goFriends}>
          <Users size={18} color={friendsActive ? 'white' : '#2C3D4F'} />
        </NavButton>

        <NavButton label={t('home.actions.groups', 'Groups')} active={groupsActive} onPress={goGroups}>
          <Users2 size={18} color={groupsActive ? 'white' : '#2C3D4F'} />
        </NavButton>

        <Pressable
          onPress={goScan}
          style={({ pressed }) => ({
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateY: -6 }],
            opacity: pressed ? 0.9 : 1,
          })}
          hitSlop={10}
        >
          <Circle size={52} bg="#2ECC71" ai="center" jc="center" elevationAndroid={4}>
            <ScanLine size={24} color="white" />
          </Circle>
          <Text mt={3} fontSize={11} color="#2ECC71">
            {t('navigation.scanReceipt', 'Scan')}
          </Text>
        </Pressable>

        <NavButton label={t('navigation.history', 'History')} active={historyActive} onPress={goHistory}>
          <Clock3 size={18} color={historyActive ? 'white' : '#2C3D4F'} />
        </NavButton>

        <NavButton label={t('navigation.tabs.profile', 'Profile')} active={profileActive} onPress={goProfile}>
          <User size={18} color={profileActive ? 'white' : '#2C3D4F'} />
        </NavButton>
      </XStack>
    </YStack>
  );
}

// --- Main TabLayout ---
export default function TabLayout() {
  const { user } = useAppStore();
  const { t } = useTranslation();


  const greetingName = user?.username || t('home.header.friendFallback', 'friend');
  const homeTitle = t('home.header.greeting', { name: greetingName });
  const homeLabel = t('navigation.tabs.home', 'Home');
  const settingsTitle = t('navigation.tabs.settings', 'Settings');
  const profileTitle = t('profile.title', 'Profile');
  const groupsTitle = t('navigation.groups.title', 'Groups');

  return (
    <Theme name="light">
      <YStack f={1} bg="$background">
        <Tabs
          screenOptions={{
            header: (props) => <GlobalTabsHeader {...props} />,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              href: null,
              title: homeTitle,
              tabBarLabel: homeLabel,
            }}
          />
          <Tabs.Screen
            name="friends/index"
            options={{
              href: null,
              title: t('friends.title', 'Friends'),
              tabBarLabel: t('home.actions.friends', 'Friends'),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              href: null,
              title: settingsTitle,
              tabBarLabel: settingsTitle,
            }}
          />
          <Tabs.Screen name="profile" options={{ href: null, title: profileTitle }} />
          <Tabs.Screen name="groups/index" options={{ href: null, title: groupsTitle }} />
        </Tabs>
        <MainBottomBar />
      </YStack>
    </Theme>
  );
}
