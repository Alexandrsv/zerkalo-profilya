import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Page from "./Page";
import { routes } from "./routes";
import { useLogin } from "./hooks/use-login";
import { useUpdateLocation } from "./hooks/use-update-location";
import { ModalContextProvider } from "./context/ModalContext";
import { AlertContextProvider } from "./context/AlertContext";
import { SnackbarContextProvider } from "./context/SnackbarContext";
import ym, { YMInitializer } from "react-yandex-metrika";
import { getUrlParams } from "./utils/get-url-params";
import { useProfileBtnStore } from "./store/profileBtnStore";

const App = () => {
  useUpdateLocation();
  const navigate = useNavigate();
  const { data: userLogin } = useLogin();
  const urlParams = getUrlParams();
  console.log({ userLogin });
  const [setVkProfileId, setIsProfileBtnActive] = useProfileBtnStore(
    (state) => [state.setVkProfileId, state.setIsProfileBtnActive]
  );
  useEffect(() => {
    const otherUserId = urlParams.vk_profile_id;
    if (urlParams.vk_ref === "third_party_profile_buttons" && otherUserId) {
      if (urlParams.vk_user_id === otherUserId) {
        ym("reachGoal", "visit-btn-profile-owner");
        navigate(`/profile/`);
      } else {
        ym("reachGoal", "visit-btn-profile-other-user");
        setVkProfileId(otherUserId);
        setIsProfileBtnActive(true);
        navigate(`/profile/${otherUserId}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVkProfileId, setIsProfileBtnActive]);

  return (
    <ModalContextProvider>
      <SnackbarContextProvider>
        <AlertContextProvider>
          <Routes>
            <Route index element={<Page path={routes.feed} />} />
            <Route path={routes.feed} element={<Page path={routes.feed} />} />
            <Route
              path={routes.profile}
              element={<Page path={routes.profile} />}
            />
            <Route path={routes.apple} element={<Page path={routes.apple} />} />
            <Route
              path={routes.otherProfile}
              element={<Page path={routes.otherProfile} />}
            />
            <Route
              path={routes.question}
              element={<Page path={routes.question} />}
            />
            <Route
              path={routes.settings}
              element={<Page path={routes.settings} />}
            />
            <Route
              path={routes.onboarding_1}
              element={<Page path={routes.onboarding_1} />}
            />
            <Route
              path={routes.onboarding_2}
              element={<Page path={routes.onboarding_2} />}
            />
            <Route
              path={routes.onboarding_3}
              element={<Page path={routes.onboarding_3} />}
            />
            <Route
              path={routes.onboarding_4}
              element={<Page path={routes.onboarding_4} />}
            />
            <Route
              path={routes.banned}
              element={<Page path={routes.banned} />}
            />
            <Route
              path={routes["no-more-questions"]}
              element={<Page path={routes["no-more-questions"]} />}
            />
            <Route path={"*"} element={<Page path={routes["404"]} />} />
          </Routes>
        </AlertContextProvider>
        <YMInitializer
          accounts={[91382964]}
          options={{
            webvisor: true,
            accurateTrackBounce: true,
            trackHash: true,
            clickmap: true,
            trackLinks: true,
            trackForms: true,
            userParams: {
              ...userLogin,
            },
          }}
          version="2"
        />
      </SnackbarContextProvider>
    </ModalContextProvider>
  );
};

export default App;
