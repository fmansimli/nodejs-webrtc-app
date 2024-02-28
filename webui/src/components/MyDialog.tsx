import * as Dialog from "@radix-ui/react-dialog";

type IProps = {
  title: string;
  open: boolean;
  children: React.ReactNode;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
  hasLeftButton: boolean;
  hasRightButton: boolean;
  leftButtonText: string;
  rightButtonText: string;
};

const MyDialog: React.FC<IProps> = (props) => (
  <Dialog.Root open={props.open}>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-mauve12 m-0 text-center text-[17px] font-medium">
          {props.title}
        </Dialog.Title>

        {props.children}

        <div className="mt-[25px] flex items-center justify-evenly">
          {props.hasLeftButton && (
            <button
              className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex items-center justify-center rounded-xl px-7 py-3 font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              onClick={props.onLeftButtonClick}>
              {props.leftButtonText}
            </button>
          )}
          {props.hasRightButton && (
            <button
              onClick={props.onRightButtonClick}
              className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex items-center justify-center rounded-xl px-7 py-3 font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              {props.rightButtonText}
            </button>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default MyDialog;
