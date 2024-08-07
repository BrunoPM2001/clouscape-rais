import {
  Modal,
  FormField,
  Input,
  Box,
  SpaceBetween,
  Form,
  Header,
  ColumnLayout,
  Button,
  Autosuggest,
} from "@cloudscape-design/components";
import { useContext, useEffect, useState } from "react";
import axiosBase from "../../../../../api/axios";
import NotificationContext from "../../../../../providers/notificationProvider";

const CreateUserModal = ({ visible, setVisible, reload }) => {
  //  Context
  const { notifications, pushNotification } = useContext(NotificationContext);

  //  States
  const [value, setValue] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({
    tipo: "Usuario_investigador",
    investigador_id: null,
    email: null,
    password: null,
  });

  //  Functions
  const getData = async () => {
    setLoading(true);
    const res = await axiosBase.get(
      "admin/admin/usuarios/searchInvestigadorBy",
      {
        params: {
          query: value,
        },
      }
    );
    const data = await res.data;
    const opt = data.map((item) => {
      return {
        detail: item.investigador_id,
        value: `${item.codigo} | ${item.doc_numero} | ${item.apellido1} ${item.apellido2}, ${item.nombres}`,
      };
    });
    setOptions(opt);
    setLoading(false);
  };

  const createUser = async () => {
    setCreating(true);
    const response = await axiosBase.post("admin/admin/usuarios/create", form);
    const data = await response.data;
    setCreating(false);
    setVisible(false);
    pushNotification(data.detail, data.message, notifications.length + 1);
    reload();
  };

  //  Effects
  useEffect(() => {
    const temp = setTimeout(() => {
      getData();
    }, 1000);
    return () => clearTimeout(temp);
  }, [value]);

  return (
    <Modal
      onDismiss={() => setVisible(false)}
      visible={visible}
      size="large"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="normal" onClick={() => setVisible(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              loading={creating}
              onClick={() => createUser()}
            >
              Crear usuario
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Crear usuario investigador"
    >
      <Form>
        <SpaceBetween direction="vertical" size="s">
          <div>
            <Header variant="h3">Datos del investigador</Header>
            <FormField label="Investigador" stretch>
              <Autosuggest
                onChange={({ detail }) => {
                  setValue(detail.value);
                }}
                onSelect={({ detail }) => {
                  if (detail.selectedOption.detail != undefined) {
                    setForm((prev) => ({
                      ...prev,
                      investigador_id: detail.selectedOption.detail,
                    }));
                  }
                }}
                value={value}
                options={options}
                loadingText="Cargando data"
                placeholder="DNI o nombre del investigador"
                ariaLabel="DNI o nombre del investigador"
                statusType={loading == true ? "loading" : "finished"}
                empty="No se encontraron resultados"
              />
            </FormField>
          </div>
          <div>
            <Header variant="h3">Datos de acceso</Header>
            <ColumnLayout columns={2}>
              <FormField label="Correo" stretch>
                <Input
                  controlId="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={({ detail }) =>
                    setForm((prev) => ({
                      ...prev,
                      email: detail.value,
                    }))
                  }
                />
              </FormField>
              <FormField label="Contraseña" stretch>
                <Input
                  controlId="password"
                  placeholder="Escriba la contraseña del usuario"
                  value={form.password}
                  onChange={({ detail }) =>
                    setForm((prev) => ({
                      ...prev,
                      password: detail.value,
                    }))
                  }
                />
              </FormField>
            </ColumnLayout>
          </div>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};

const ResetPasswordModal = ({ visible, setVisible, item }) => {
  //  Context
  const { notifications, pushNotification } = useContext(NotificationContext);

  //  States
  const [loading, setLoading] = useState(false);

  //  Functions
  const resetPass = async () => {
    setLoading(true);
    const response = await axiosBase.put("admin/admin/usuarios/resetPass", {
      id: item[0].id,
    });
    const data = await response.data;
    setLoading(false);
    setVisible(false);
    pushNotification(data.detail, data.message, notifications.length + 1);
  };

  return (
    <Modal
      onDismiss={() => setVisible(false)}
      visible={visible}
      size="medium"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="normal" onClick={() => setVisible(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              loading={loading}
              onClick={() => resetPass()}
            >
              Resetar contraseña
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Reiniciar contraseña"
    >
      ¿Estás seguro de reiniciar la contraseña de este usuario? La contraseña
      regresará a la por defecto
    </Modal>
  );
};

const DeleteModal = ({ visible, setVisible, item, reload }) => {
  //  Context
  const { notifications, pushNotification } = useContext(NotificationContext);

  //  States
  const [loading, setLoading] = useState(false);

  //  Functions
  const deleteUser = async () => {
    setLoading(true);
    const response = await axiosBase.delete("admin/admin/usuarios/delete", {
      data: {
        idUser: item[0].id,
        tipo: "Usuario_investigador",
      },
    });
    const data = await response.data;
    setLoading(false);
    setVisible(false);
    pushNotification(data.detail, data.message, notifications.length + 1);
    reload();
  };

  return (
    <Modal
      onDismiss={() => setVisible(false)}
      visible={visible}
      size="medium"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="normal" onClick={() => setVisible(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              loading={loading}
              onClick={() => deleteUser()}
            >
              Eliminar usuario
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Eliminar usuario investigador"
    >
      ¿Estás seguro de eliminar a este usuario? La acción no se puede deshacer
    </Modal>
  );
};

const TemporalModal = ({ visible, setVisible, item }) => {
  //  Context
  const { notifications, pushNotification } = useContext(NotificationContext);

  //  States
  const [loading, setLoading] = useState(false);

  //  Functions
  const createTemporal = async () => {
    setLoading(true);
    const response = await axiosBase.put(
      "admin/admin/usuarios/createTemporal",
      {
        id: item[0].id,
      }
    );
    const data = await response.data;
    setLoading(false);
    setVisible(false);
    pushNotification(data.detail, data.message, notifications.length + 1);
  };

  return (
    <Modal
      onDismiss={() => setVisible(false)}
      visible={visible}
      size="large"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="normal" onClick={() => setVisible(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              loading={loading}
              onClick={() => createTemporal()}
            >
              Crear usuario temporal
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Crear usuario temporal"
    >
      ¿Estás seguro de crear un usuario temporal a este investigador? La sesión
      del usuario creado durará hasta la media noche del día de hoy
    </Modal>
  );
};

export { CreateUserModal, ResetPasswordModal, DeleteModal, TemporalModal };
