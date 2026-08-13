import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Heading,
  Label,
  Select,
  Input,
  toast,
} from "@medusajs/ui"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { AdminCollection } from "@medusajs/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { sdk } from "../lib/sdk"

type DropMeta = {
  drop_image?: string | null
  drop_type?: "drop" | "capsule" | "archive"
  drop_subtitle?: string | null
}

const DROP_TYPE_OPTIONS = [
  { value: "drop", label: "Drop (édition limitée)" },
  { value: "capsule", label: "Capsule" },
  { value: "archive", label: "Archive" },
]

const CollectionDropWidget = ({ data: collection }: DetailWidgetProps<AdminCollection>) => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Lit la metadata actuelle de la collection
  const { data: dropMeta, isLoading } = useQuery({
    queryKey: ["collection-drop", collection.id],
    queryFn: async () => {
      const { collection: col } = await sdk.admin.productCollection.retrieve(collection.id, {
        fields: "id,metadata",
      })
      const meta = (col.metadata ?? {}) as DropMeta
      return meta
    },
  })

  const [meta, setMeta] = useState<DropMeta>({})

  // Init du state local quand la metadata arrive
  useEffect(() => {
    if (dropMeta) {
      setMeta({
        drop_image: dropMeta.drop_image ?? null,
        drop_type: dropMeta.drop_type ?? "drop",
        drop_subtitle: dropMeta.drop_subtitle ?? "",
      })
    }
  }, [dropMeta])

  // Upload d'une image → renvoie une URL
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const res = await sdk.admin.upload.create({ files: [file] })
      return res.files[0]
    },
    onSuccess: (file) => {
      setMeta((prev) => ({ ...prev, drop_image: file.url }))
      toast.success("Image uploadée. Pense à sauvegarder.")
    },
    onError: () => toast.error("Échec de l'upload"),
  })

  // Save → update la collection avec le metadata mergé.
  // On n'envoie que les champs définis (non-null) car Medusa fait un deep
  // merge de metadata et ignore les null.
  const saveMutation = useMutation({
    mutationFn: async (next: DropMeta) => {
      const metadata: Record<string, unknown> = {}
      if (next.drop_image) metadata.drop_image = next.drop_image
      if (next.drop_type) metadata.drop_type = next.drop_type
      if (next.drop_subtitle) metadata.drop_subtitle = next.drop_subtitle
      const res = await sdk.admin.productCollection.update(collection.id, {
        metadata,
      } as any)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection-drop", collection.id] })
      toast.success("Drop mis à jour — le storefront suit automatiquement.")
    },
    onError: (err: any) => {
      console.error("[2TIJEN] save drop error", err)
      toast.error("Échec de la sauvegarde — voir la console")
    },
  })

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    uploadMutation.mutate(files[0])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSave = () => saveMutation.mutate(meta)

  const handleRemoveImage = () =>
    setMeta((prev) => ({ ...prev, drop_image: null }))

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center p-8">
        <p className="text-ui-fg-muted text-sm">Chargement…</p>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Drop</Heading>
      </div>

      <div className="flex flex-col gap-6 px-6 py-4">
        {/* Image du drop */}
        <div className="flex flex-col gap-2">
          <Label>Image du drop</Label>
          {meta.drop_image ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-subtle">
              <img
                src={meta.drop_image}
                alt="Drop"
                className="h-full w-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 rounded-md border border-ui-border-base bg-ui-bg-base px-2 py-1 text-xs hover:bg-ui-bg-subtle-hover"
              >
                Retirer
              </button>
            </div>
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-dashed border-ui-border-base bg-ui-bg-subtle text-ui-fg-muted">
              {uploadMutation.isPending ? "Upload en cours…" : "Aucune image"}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={(e) => handleFileSelect(e.target.files)}
            hidden
          />
          <Button
            size="small"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploadMutation.isPending}
          >
            {meta.drop_image ? "Changer l'image" : "Uploader une image"}
          </Button>
          <p className="text-ui-fg-subtle text-xs">
            Si vide, le storefront reconnecte automatiquement la 1ʳᵉ image
            produit de la collection.
          </p>
        </div>

        {/* Type de drop */}
        <div className="flex flex-col gap-2">
          <Label>Type de drop</Label>
          <Select
            value={meta.drop_type ?? "drop"}
            onValueChange={(value) =>
              setMeta((prev) => ({
                ...prev,
                drop_type: value as DropMeta["drop_type"],
              }))
            }
          >
            <Select.Trigger>
              <Select.Value placeholder="Type" />
            </Select.Trigger>
            <Select.Content>
              {DROP_TYPE_OPTIONS.map((opt) => (
                <Select.Item key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Sous-titre */}
        <div className="flex flex-col gap-2">
          <Label>Sous-titre</Label>
          <Input
            value={meta.drop_subtitle ?? ""}
            onChange={(e) =>
              setMeta((prev) => ({ ...prev, drop_subtitle: e.target.value }))
            }
            placeholder="ex. Sérigraphie locale · édition limitée"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            isLoading={saveMutation.isPending}
          >
            Sauvegarder
          </Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product_collection.details",
})

export default CollectionDropWidget