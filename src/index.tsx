import ReactDOM from 'react-dom/client';

import { Root } from '@/components/Root';

// Uncomment this import in case, you would like to develop the application even outside
// the Telegram application, just in your browser.
import './mockEnv.ts';

import '@telegram-apps/telegram-ui/dist/styles.css';
<<<<<<< HEAD
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<Root/>);
=======
import './index.scss';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);

>>>>>>> v2
