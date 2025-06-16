import React, { FC } from "react";
import {
  Badge,
  Cell,
  Group,
  Panel,
  PanelHeader,
  SplitCol,
  useAdaptivityConditionalRender,
} from "@vkontakte/vkui";
import {
  Icon28NewsfeedOutline,
  Icon28SettingsOutline,
  Icon28UserCircleOutline,
} from "@vkontakte/icons";
import { PageNames } from "../../routes";
import { panelNames } from "../../const/panel-names";
import { useQuestions } from "../../hooks/use-questions";
import { checkUnwatchedFeedback } from "../../utils/check-unwatched-feedback";

const MenuPanel: FC<{
  onStoryChange: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  hasHeader: boolean;
  activeStory: PageNames;
  className?: string;
}> = ({ onStoryChange, hasHeader, activeStory, className }) => {
  const { questions } = useQuestions({ owner: true });
  const hasUnwatched = checkUnwatchedFeedback(questions);
  const { viewWidth } = useAdaptivityConditionalRender();
  console.log("qwed", viewWidth.tabletPlus);

  return (
    <SplitCol
      fixed
      width={200}
      maxWidth={200}
      className={className}
      style={{
        marginLeft:
          "var(--vkui--size_split_col_padding_horizontal--regular,16px)",
      }}
    >
      <Panel>
        {hasHeader && <PanelHeader transparent={true} />}
        <Group>
          <Cell
            disabled={activeStory === "feed"}
            style={
              activeStory === "feed"
                ? {
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8,
                  }
                : {}
            }
            data-story="feed"
            onClick={onStoryChange}
            before={<Icon28NewsfeedOutline />}
          >
            {panelNames.feed}
          </Cell>
          <Cell
            disabled={activeStory === "profile"}
            style={
              activeStory === "profile"
                ? {
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8,
                  }
                : {}
            }
            data-story="profile"
            onClick={onStoryChange}
            before={<Icon28UserCircleOutline />}
            after={
              hasUnwatched && (
                <Badge mode="prominent" className={"animate-pulse"} />
              )
            }
          >
            {panelNames.profile}
          </Cell>
          <Cell
            disabled={activeStory === "settings"}
            style={
              activeStory === "settings"
                ? {
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8,
                  }
                : {}
            }
            data-story="settings"
            onClick={onStoryChange}
            // indicator={<Badge mode="prominent" />}
            before={<Icon28SettingsOutline />}
          >
            {panelNames.settings}
          </Cell>
        </Group>
      </Panel>
    </SplitCol>
  );
};

export default MenuPanel;
