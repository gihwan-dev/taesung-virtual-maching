/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "./sockets.io";

const DeviceState = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [selected, setSelected] = useState<number>(1);

  const [selectedData, setSelectedData] = useState({
    ds_door: 0,
    ds_bat: 0,
    ds_collect: 0,
    ds_remoteCollect: 0,
    ds_stop: 0,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const getData = async () => {
    const res = await fetch("/api/state/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data !== null) {
      setSelectedData(data[selected - 1]);
    }
  }, [selected, data]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = (event.target as HTMLInputElement).value;
    setSelected(parseInt(value));
  };

  if (data === null) {
    return <h1>loading...</h1>;
  }

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("ds_idx", selected.toString());
    formData.append("di_idx", data[selected - 1].di_idx.toString());
    const newData = Object.fromEntries(formData.entries());

    socket.emit("set-device-state", newData);
  };

  return (
    <div
      style={{
        paddingTop: "1.5rem",
      }}
    >
      <h1>기기 상태</h1>
      <FormControl fullWidth>
        <Select
          value={selected}
          onChange={handleChange}
        >
          {data?.map((d) => {
            return (
              <MenuItem
                value={d.ds_idx as number}
                key={`device-state-${d.ds_idx}`}
              >
                {d.ds_idx}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <form
        onSubmit={onSubmitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <label>ds_door</label>
        <input
          type="number"
          defaultValue={selectedData.ds_door}
          onChange={handleInputChange}
          value={selectedData.ds_door}
          name="ds_door"
          placeholder="ds_door"
        />
        <label>ds_bat</label>
        <input
          type="number"
          defaultValue={selectedData.ds_bat}
          onChange={handleInputChange}
          value={selectedData.ds_bat}
          name="ds_bat"
          placeholder="ds_bat"
        />
        <label>ds_collect</label>
        <input
          type="number"
          defaultValue={selectedData.ds_collect}
          onChange={handleInputChange}
          value={selectedData.ds_collect}
          name="ds_collect"
          placeholder="ds_collect"
        />
        <label>ds_remoteCollect</label>
        <input
          type="number"
          defaultValue={selectedData.ds_remoteCollect}
          onChange={handleInputChange}
          value={selectedData.ds_remoteCollect}
          name="ds_remoteCollect"
          placeholder="ds_remoteCollect"
        />
        <label>ds_stop</label>
        <input
          type="number"
          defaultValue={selectedData.ds_stop}
          onChange={handleInputChange}
          value={selectedData.ds_stop}
          name="ds_stop"
          placeholder="ds_stop"
        />
        <button type="submit">완료</button>
      </form>
    </div>
  );
};

export default DeviceState;
