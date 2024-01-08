import { ReceiveQRCodeScreen } from './receive-qrcode';
import { ReceiveTagScreen } from './receive-tag';
import { ReceiveAmountScreen } from './receive-amount';
import { ReceiveScreenType } from 'app/features/send/types';
import { AnimationLayout } from 'app/components/layout/animation-layout';
import {
  SubScreenProvider,
  TransferProvider,
  useSubScreenContext
} from 'app/features/send/providers';

const screens = {
  home: ReceiveQRCodeScreen,
  'receive-qrcode': ReceiveQRCodeScreen,
  'receive-tag': ReceiveTagScreen,
  'receive-amount': ReceiveAmountScreen,
};

const Screen = () => {
  const { currentComponent, direction } = useSubScreenContext()

  const ScreenComponent = screens[currentComponent as ReceiveScreenType];

  return (
    <TransferProvider>
      <AnimationLayout currentKey={currentComponent} direction={direction}>
        <ScreenComponent />
      </AnimationLayout>
    </TransferProvider>
  );
};

export const ReceiveScreen = () => <SubScreenProvider><Screen /></SubScreenProvider>