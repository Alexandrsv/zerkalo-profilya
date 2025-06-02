import React, { FC, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  FormItem,
  FormLayoutGroup,
  Input,
  Select,
} from "@vkontakte/vkui";
import { IUser, PatchUserInput } from "../../api/user";
import { useActivityStore } from "../../store/activityStore";

const EditUserInfoForm: FC<{
  user?: IUser;
  buttonText: string;
  updateUser: (user: PatchUserInput) => Promise<void>;
  variant?: "default" | "modal";
}> = ({ user, buttonText, updateUser, variant }) => {
  const [age, setAge] = useState<number | string>("");
  const [sex, setSex] = useState<number | string>("0");
  const [profession, setProfession] = useState<string>("");
  const [ageError, setAgeError] = useState(false);
  const [sexError, setSexError] = useState(false);
  const [professionError, setProfessionError] = useState(false);
  const [isTryingToSubmit, setIsTryingToSubmit] = useState(false);
  const isModal = variant === "modal";

  const setIsWriteText = useActivityStore((state) => state.setIsWriteText);

  useEffect(() => {
    if (user?.age) {
      setAge(user?.age);
    }
  }, [user?.age]);
  useEffect(() => {
    if (user?.sex) {
      setSex(user?.sex);
    }
  }, [user?.sex]);

  useEffect(() => {
    if (user?.profession.trim()) {
      setProfession(user?.profession.trim());
    } else if (user?.age && user.age <= 17) {
      setProfession("Школьник");
    } else if (user?.age && user.age <= 22) {
      setProfession("Студент");
    }
  }, [user?.age, user?.profession]);

  const checkAgeValid = (age: string) => {
    return !!age && +age >= 9 && +age <= 120 && /^\d+$/g.test(age);
  };

  const checkProfessionValid = (profession: string) => {
    return (
      !!profession.trim() &&
      profession.trim().length <= 35 &&
      profession.trim().length >= 2
    );
  };

  const onChangeAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAge = e.target.value;
    const isValid = checkAgeValid(inputAge);
    if (isValid) {
      setAgeError(false);
    }
    setAge(inputAge);
  };
  const onChangeSex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "0") {
      setSexError(false);
    }
    setSex(e.target.value);
  };
  const onChangeProfession = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputProfession = e.target.value;
    if (checkProfessionValid(inputProfession)) {
      setProfessionError(false);
    }
    setProfession(e.target.value);
  };

  const onClickSubmit = async () => {
    setIsTryingToSubmit(true);
    let newUserParams: PatchUserInput = {};

    if (!checkAgeValid(age.toString())) {
      if (isModal) {
        setAgeError(true);
        return;
      }

      if (age) {
        setAgeError(true);
        return;
      }
    }
    newUserParams.age = +age;

    if (sex === "0") {
      if (isModal) {
        return setSexError(true);
      }
    }
    newUserParams.sex = +sex as IUser["sex"];

    if (!checkProfessionValid(profession)) {
      if (isModal) {
        return setProfessionError(true);
      }
      if (profession) {
        return setProfessionError(true);
      }
    }
    newUserParams.profession = profession;

    await updateUser(newUserParams);
  };

  return (
    <div className={"grow flex flex-col h-full"}>
      <div>
        <FormLayoutGroup mode="vertical">
          <FormItem
            top="Возраст"
            status={isTryingToSubmit && ageError ? "error" : "default"}
            bottom={
              isTryingToSubmit &&
              ageError &&
              "Пожалуйста, укажите ваш возраст, в диапазоне от 9 до 120 лет"
            }
          >
            <Input
              type="number"
              min={9}
              max={120}
              align={"left"}
              value={age}
              onFocus={() => setIsWriteText(true)}
              onBlur={() => setIsWriteText(false)}
              onChange={onChangeAge}
            />
          </FormItem>
          <FormItem
            top="Пол"
            status={isTryingToSubmit && sexError ? "error" : "default"}
            bottom={isTryingToSubmit && sexError && "Пожалуйста, выберите пол"}
          >
            <Select
              value={sex}
              // onChange={(e) => setAlign(e.target.value)}
              selectType="default"
              onChange={onChangeSex}
              options={[
                { label: "Не выбрано", value: "0" },
                { label: "Женский", value: "1" },
                { label: "Мужской", value: "2" },
              ]}
            />
          </FormItem>
          <FormItem
            top="Профессия"
            status={isTryingToSubmit && professionError ? "error" : "default"}
            bottom={
              isTryingToSubmit &&
              professionError &&
              "Пожалуйста, укажите вашу профессию. Допустимо от 2х до 35 символов"
            }
          >
            <Input
              value={profession}
              onFocus={() => setIsWriteText(true)}
              onBlur={() => setIsWriteText(false)}
              onChange={onChangeProfession}
            />
          </FormItem>
        </FormLayoutGroup>
      </div>
      <div className={"grow flex justify-center px-4 pb-24"}>
        <ButtonGroup>
          <Button
            size="l"
            mode="primary"
            className={"self-end !px-10"}
            onClick={onClickSubmit}
          >
            {buttonText}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default EditUserInfoForm;
