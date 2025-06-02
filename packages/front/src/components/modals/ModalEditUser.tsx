import React, { FC } from "react";
import { Group } from "@vkontakte/vkui";
import EditUserInfoForm from "../edit-user-info-form/EditUserInfoForm";
import { useAppUser } from "../../hooks/use-app-user";
import { PatchUserInput } from "../../api/user";
import ModalsPageHeader from "./ModalsPageHeader";

const ModalEditUser: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { user, updateUser } = useAppUser();

  const onSubmit = async (user: PatchUserInput) => {
    await updateUser(user);
    onClose();
  };

  return (
    <>
      <ModalsPageHeader onClose={onClose} title="Изменить профиль" />

      <Group>
        <EditUserInfoForm
          buttonText={"Сохранить"}
          updateUser={onSubmit}
          user={user}
          variant={"modal"}
        />
      </Group>
    </>
  );
};

export default ModalEditUser;
