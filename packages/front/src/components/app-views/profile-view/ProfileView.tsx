import React, { FC } from "react";
import {
  Button,
  ButtonGroup,
  Div,
  Group,
  Panel,
  PanelHeader,
  PanelSpinner,
  Separator,
  Spacing,
  View,
  Text,
} from "@vkontakte/vkui";
import { PageNames, routes } from "../../../routes";
import { useAppUser } from "../../../hooks/use-app-user";
import ProfileHeader from "./ProfileHeader";
import ProfileQuestions from "./ProfileQuestions";
import { AgeEditSimpleCell } from "./AgeEditSimpleCell";
import { ProfessionEditSimpleCell } from "./ProfessionEditSimpleCell";
import { panelNames } from "../../../const/panel-names";
import { useModal } from "../../../hooks/use-modal";
import { EModals } from "../../../context/ModalContext";
import HelpBtn from "../../help-btn/HelpBtn";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionsList } from "../../questions-list/QuestionsList";
import { useQuestions } from "../../../hooks/use-questions";
import { useUser } from "../../../hooks/use-user";
import OtherProfileHeader from "./OtherProfileHeader";
import { Icon20ArrowDownOutline } from "@vkontakte/icons";

const ProfileView: FC<{ id: PageNames }> = ({ id }) => {
  let { profileId = "" } = useParams();
  const navigate = useNavigate();
  const { questions } = useQuestions(
    profileId ? { authorVkId: profileId } : { owner: true }
  );
  const { setModal } = useModal();
  const { user: appUser } = useAppUser();
  const { user: otherUser } = useUser(profileId);
  const onClickEdit = () => {
    setModal({ modalName: EModals.EDIT_USER });
  };

  const goToOnboarding = () => {
    navigate(routes.onboarding_1);
  };

  return (
    <View id={id} activePanel={profileId ? "otherProfile" : "profileOwner"}>
      <Panel id={"profileOwner"}>
        <PanelHeader>{panelNames.profile}</PanelHeader>
        {!appUser ? (
          <PanelSpinner />
        ) : (
          <>
            <Group>
              <ProfileHeader appUser={appUser} />
              <Spacing size={24}>
                <Separator />
              </Spacing>
              <Div>
                <AgeEditSimpleCell
                  age={appUser.age}
                  onClickEdit={onClickEdit}
                />
                <ProfessionEditSimpleCell
                  profession={appUser.profession}
                  onClickEdit={onClickEdit}
                />
              </Div>

              <HelpBtn />
            </Group>
            <ProfileQuestions questions={questions} />
          </>
        )}
      </Panel>
      <Panel id={"otherProfile"}>
        <PanelHeader>{`Профиль`}</PanelHeader>
        {!otherUser ? (
          <PanelSpinner />
        ) : (
          <>
            <OtherProfileHeader otherUser={otherUser} appUser={appUser} />
            <Group>
              <QuestionsList questions={questions} isOtherProfile={true} />
            </Group>
            <Group>
              <Div className={"flex flex-col items-end"}>
                <div className={"flex  items-center"}>
                  <Icon20ArrowDownOutline className={"mb-3"} />
                  <Text weight={"3"} className={"pb-3"}>
                    Но зачем?
                  </Text>
                </div>
                <ButtonGroup stretched>
                  <Button size={"l"} stretched onClick={goToOnboarding}>
                    Что тут происходит?
                  </Button>
                </ButtonGroup>
              </Div>
            </Group>
          </>
        )}
      </Panel>
    </View>
  );
};

export default ProfileView;
