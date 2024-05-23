import { useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useVerifyMessage,
} from "wagmi";
import { type SignableMessage, type Address, type Hex } from "viem";

type Inputs = {
  message: string;
};

const VerifyMessage = ({
  address,
  message,
  signature,
}: {
  address: Address;
  message: SignableMessage;
  signature: Hex;
}) => {
  const {
    isError,
    error,
    data: isVerify,
  } = useVerifyMessage({
    address,
    message,
    signature,
  });
  return (
    <div>
      {isVerify && <div>verify success: sign with address {address}</div>}
      {isError && <div>verify error: {error.message}</div>}
    </div>
  );
};

const PersonalSign = () => {
  const { signMessage, isPending, isSuccess, data: hash } = useSignMessage();
  const { address } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  const _handleSubmit: SubmitHandler<Inputs> = useCallback(
    (data) => {
      signMessage({ message: data.message });
    },
    [signMessage]
  );

  const message = watch("message");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Person sign</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(_handleSubmit)}
          className="flex flex-col gap-3"
        >
          <Label>
            <span>Sign message</span>
            <Input
              defaultValue={`Hi --${new Date().toTimeString()}`}
              {...register("message", { required: true })}
            />
          </Label>
          <Button disabled={isPending} loading={isPending} type="submit" className="w-full">
            SIGN MESSAGE
          </Button>
        </form>

        {isSuccess && address && (
          <VerifyMessage message={message} address={address} signature={hash} />
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalSign;
