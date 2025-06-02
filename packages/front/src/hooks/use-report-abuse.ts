import { postAbuseFetcher } from "../api/abuse";
import { useAppUser } from "./use-app-user";
import { useModal } from "./use-modal";
import { EModals } from "../context/ModalContext";
import { useState } from "react";

interface IAbuseInput {
  text: string;
  successCb?: (statusCode: number) => void;
  questionId?: string;
  reason?: string;
}

export const useReportAbuse = () => {
  const { user } = useAppUser();
  const { getModalMeta, setModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

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
      if (reportResponse.data && successCb) {
        successCb(reportResponse.status);
      }
    } else {
      console.error({ meta });
      throw new Error("Ошибка при формировании данных модалки жалобы");
    }
  };

  const reportAbuse = async ({ text, questionId, reason }: IAbuseInput) => {
    setIsLoading(true);
    try {
      if (user?.id) {
        const reportResponse = await postAbuseFetcher({
          questionId,
          text,
          authorId: user.id,
        });
        return reportResponse.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendAbuse, showAbuseModal, reportAbuse, isLoading };
};
