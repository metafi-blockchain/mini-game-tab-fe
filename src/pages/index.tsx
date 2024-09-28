import { Button } from '@/components'
import { telegramInitDataRawToObject } from '@/utils'
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import {
  Modal,
  Placeholder,
  Progress,
  Spinner
} from '@telegram-apps/telegram-ui'
import { useEffect, useState, type FC } from 'react'
import { Link } from 'react-router-dom'

// Define UserInfo
export interface UserInfo {
  name: string
  username: string
  referId: string
  isPremium: boolean
}

// Define endpoints
const API_URL = 'https://miniapp.kingdoms.game/api'
const API_GET_INFO = `${API_URL}/user/me`
const API_REGISTER = `${API_URL}/user/create-account`
const API_PLAY = `${API_URL}/user/increase-point`
const TABS = [
  {
    id: 'tab-1',
    text: 'Tap',
    image: '/assets/images/tabs/tap.png',
    activeImage: '/assets/images/tabs/tap-active.png'
  },
  {
    id: 'tab-2',
    text: 'Earn',
    image: '/assets/images/tabs/earn.png',
    activeImage: '/assets/images/tabs/earn-active.png'
  },
  {
    id: 'tab-3',
    text: 'Task',
    image: '/assets/images/tabs/task.png',
    activeImage: '/assets/images/tabs/task-active.png'
  },
  {
    id: 'tab-4',
    text: 'Rank',
    image: '/assets/images/tabs/rank.png',
    activeImage: '/assets/images/tabs/rank-active.png'
  },
  {
    id: 'tab-5',
    text: 'Wallet',
    image: '/assets/images/tabs/wallet.png',
    activeImage: '/assets/images/tabs/wallet-active.png'
  }
]
const PLAY_IMAGE = '/assets/images/play.gif'

export const IndexPage: FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)
  const [error, setError] = useState('')
  const [currentTab, setCurrentTab] = useState(TABS[0].id)

  const [playImage, setPlayImage] = useState(PLAY_IMAGE)

  // Get Telegram init raw data
  const { initDataRaw } = retrieveLaunchParams()
  const teleUser = telegramInitDataRawToObject(initDataRaw ?? '')
  console.log(teleUser)

  // Define header config
  const headerConfig: Partial<RequestInit> = {
    headers: {
      //Authorization: `tma query_id=AAFCficsAAAAAEJ-JywGIiU5&user=%7B%22id%22%3A740785730%2C%22first_name%22%3A%22Tho%E1%BA%A1i%22%2C%22last_name%22%3A%22Nguyen%22%2C%22username%22%3A%22roster90%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1727479557&hash=240e2bedd123218206ba3d728f044cb4be02fdaebc109f3dc82db33832b5dd8e`,
      Authorization: `tma ${initDataRaw}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Function to call api to create new account
   */
  const createNewAccount = async () => {
    // Convert data from Telegram to user account
    const appUser = {
      name: `${teleUser.user.first_name} ${teleUser.user.last_name}`,
      username: teleUser.user.username,
      referId: null,
      isPremium: teleUser.user.is_premium
    }

    // Call api to create new account
    const response = await fetch(API_REGISTER, {
      method: 'POST',
      ...headerConfig,
      body: JSON.stringify(appUser)
    })

    // Return account info
    // TODO
    const userData = await response.json()
    setUserInfo(userData.data as UserInfo)
  }

  useEffect(() => {
    async function initPage() {
      // Call api get user info
      fetch(API_GET_INFO, {
        method: 'GET',
        ...headerConfig
      })
        .then(async (res) => {
          // Create new account
          console.log(res)
          if (res.status === 403) {
            await createNewAccount()
            // TODO
            return
          }

          // Set user info
          if (res.status === 200) {
            const userData = await res.json()
            if (!userData.data) {
              await createNewAccount()
            } else {
              setUserInfo(userData.data as UserInfo)
            }
          }

          // Other case
          // TODO
        })
        .catch((err) => {
          console.log(err)
          // TODO
          setError(err.toString())
        })
    }

    initPage()
  }, [])

  /**
   * Handle click button play
   */
  const handleClick = async () => {
    // Start animation when tap
    setPlayImage(`${PLAY_IMAGE}?v=${new Date().getTime()}`)

    // Call api to update point
    const res = await fetch(API_PLAY, {
      method: 'PUT',
      ...headerConfig
    })
    console.log(res)
  }

  /**
   * Handle modal open change
   * @param open is modal open?
   */
  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setError('')
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* TOP */}
      <div className='top'>
        <div className='inner'>
          <div className='point'>
            <img src='/assets/images/coin.png' alt='' />
            <span>109 391</span>
          </div>
          <div className='progress'>
            <img
              src='/assets/images/progress-thumb.png'
              style={{ left: `${20}%` }}
              alt=''
            />
            <Progress className='progress-bar' value={20} />
          </div>
          <div className='info'>
            <div className='level'>
              <img src='/assets/images/level.png' alt='' />
              <span>3</span>
            </div>
            <div className='tap'>
              <img src='/assets/images/tap.png' alt='' />
              <span>Tap: 123</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className='main'>
        <div className='inner'>
          {/* Loading */}
          <div
            className={`clickable ${!userInfo ? 'loading' : ''}`}
            onClick={handleClick}
          >
            {!userInfo ? <Spinner className='loading' size='l' /> : <></>}
            <img className='sub-img' src={playImage} alt='' />
            <img className='main-img' src='/assets/images/image.png' alt='' />
          </div>
          {/* Play game */}
          <Button size='sm' variant='warning' className='tap'>
            <div>
              <img src='/assets/images/flash.png' height={20} alt='' />
              200/600
            </div>
          </Button>
        </div>
      </div>

      {/* BOTTOM */}
      <div className='bottom'>
        <div className='inner'>
          <div className='bottom-tabs'>
            {TABS.map(({ id, text, image, activeImage }) => (
              <Link
                to='/'
                className={`bottom-tab ${id === currentTab ? 'active' : ''}`}
                key={id}
                onClick={() => setCurrentTab(id)}
              >
                <div className='icon' title={text}>
                  <img className='default' src={image} alt='' />
                  <img className='active' src={activeImage} alt='' />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Error message */}
      <Modal open={error !== ''} onOpenChange={handleModalOpenChange}>
        <Placeholder description={error} header='Error'>
          <img
            alt='Telegram sticker'
            src='https://xelene.me/telegram.gif'
            style={{
              display: 'block',
              height: '144px',
              width: '144px'
            }}
          />
        </Placeholder>
      </Modal>
    </div>
  )
}
