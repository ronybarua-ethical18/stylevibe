import dynamic from 'next/dynamic'
import styles from './page.module.css'
const NoSSR = dynamic(() => import('../components/ui/LandingPage'), { ssr: false })

// export const metaData:Metadata = homePage
export default function Home() {
  return (
    <main className={styles.main}>
       <NoSSR />
    </main>
  )
}
