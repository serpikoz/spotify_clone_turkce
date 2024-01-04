"use client";

import uniqid from "uniqid";
import React, { useState } from "react";
import Modal from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Eksikleri tamamlayın");
        return;
      }

      const uniqueID = uniqid();

      //Şarkı yükleme

      const { data: songData, error: SongError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (SongError) {
        setIsLoading(false);
        return toast.error("Şarkı yüklemede hata var");
      }

      //Resim yükleme

      const { data: imageData, error: ImageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqueID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (ImageError) {
        setIsLoading(false);
        return toast.error("Fotoğraf yüklemede hata var");
      }
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
        });
      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Şarkı oluşturuldu");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("Bir şeylerde sorun var...");
    } finally {
      setIsLoading(false);
    }

    // Handle form submission logic here
  };

  return (
    <Modal
      title="Şarkı Ekle"
      description="Mp3 dosyasını yükle"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", {
            required: true,
          })}
          placeholder="Şarkı adı"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", {
            required: true,
          })}
          placeholder="Sanatçı"
        />
        <div>
          <div className="pb-1">Şarkını Seç</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", {
              required: true,
            })}
          />
        </div>
        <div>
          <div className="pb-1">Fotoğraf Seç</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", {
              required: true,
            })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Oluştur
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
