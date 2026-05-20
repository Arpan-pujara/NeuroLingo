import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function SignInScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text>Sign in</Text>
      <Link href="/sign-up">
        <Text>Go to sign up</Text>
      </Link>
    </View>
  )
}
