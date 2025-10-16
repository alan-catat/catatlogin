interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (options: {
          client_id: string;
          callback: (response: any) => void;
        }) => void;
        renderButton?: (
          parent: HTMLElement,
          options: Record<string, any>
        ) => void;
        prompt: (options?: { use_fedcm_for_prompt?: boolean }) => void; // 👈 tambahkan baris ini
      };
    };
  };
}
