import { postAbuseFetcher } from "../api/abuse";
import { useAppUser } from "./use-app-user";
import { useModal } from "./use-modal";
import { EModals } from "../context/ModalContext";

interface IAbuseInput {
  text: string;
  successCb: (statusCode: number) => void;
}

export const useReportAbuse = () => {
  const { user } = useAppUser();
  const { getModalMeta, setModal } = useModal();

  const showAbuseModal: (params: {
    questionId: string;
    feedbackId?: string;
  }) => void = ({ questionId, feedbackId }) => {
    setModal({
      modalName: EModals.REPORT_ABUSE,
      meta: { questionId, feedbackId },
    });
  };

  const sendAbuse = async ({ text, successCb }: IAbuseInput) => {
    const meta = getModalMeta();

    if (
      typeof meta === "object" &&
      user?.id &&
      (meta?.questionId || meta?.feedbackId)
    ) {
      const reportResponse = await postAbuseFetcher({
        questionId: meta?.questionId || undefined,
        feedbackId: meta?.feedbackId || undefined,
        text,
        authorId: user.id,
      });
      if (reportResponse.data) {
        successCb(reportResponse.status);
      }
    } else {
      console.error({ meta });
      throw new Error("Ошибка при формировании данных модалки жалобы");
    }
  };

  return { sendAbuse, showAbuseModal };
};
