import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function SignUpScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text>Sign up</Text>
      <Link href="/sign-in">
        <Text>Go to sign in</Text>
      </Link>
    </View>
  )
}
