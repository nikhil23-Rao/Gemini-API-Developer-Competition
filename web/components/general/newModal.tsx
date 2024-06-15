import { motion } from "framer-motion";

interface IProps {
  setModal: (i: boolean) => void;
  modal: boolean;
  children: React.ReactNode;
}

export const NewModal = ({ setModal, modal, children }: IProps) => {
  if (modal)
    return (
      <>
        <i
          className="fa fa-window-close fa-2x"
          style={{
            color: "red",
            position: "absolute",
            top: 50,
            right: 100,
            cursor: "pointer",
          }}
          onClick={() => setModal(false)}
        ></i>
        <motion.div
          initial={{ opacity: 0, y: 300 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          animate={{ y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginBottom: 40,
          }}
        >
          {children}
        </motion.div>
      </>
    );
};
