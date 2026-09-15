import { Seo } from "@/components/shared/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  EventItem,
  FinancialReport,
  ImpactStory,
  PageContent,
  Partner,
  Program,
  VolunteerApplication,
  VolunteerRole,
} from "@/lib/data/mockData";
import { useData } from "@/lib/data/store";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CalendarDays,
  FileText,
  HandHeart,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { type ReactNode, useState } from "react";

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      data-ocid="empty_state"
      className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-12 text-center"
    >
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

/* ------------------------------ Stories ------------------------------ */

interface StoryFormState {
  name: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  featured: boolean;
}

const EMPTY_STORY: StoryFormState = {
  name: "",
  title: "",
  excerpt: "",
  content: "",
  category: "Education",
  date: new Date().toISOString().slice(0, 10),
  featured: false,
};

function StoriesSection() {
  const { data, addItem, updateItem, deleteItem, addNotification } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ImpactStory | null>(null);
  const [form, setForm] = useState<StoryFormState>(EMPTY_STORY);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_STORY);
    setOpen(true);
  };

  const openEdit = (story: ImpactStory) => {
    setEditing(story);
    setForm({
      name: story.name,
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
      category: story.category,
      date: story.date,
      featured: story.featured,
    });
    setOpen(true);
  };

  const set = <K extends keyof StoryFormState>(
    key: K,
    value: StoryFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.name.trim() || !form.title.trim()) return;
    if (editing) {
      updateItem("stories", editing.id, form);
      addNotification(`Impact story "${form.title}" updated.`, "success");
    } else {
      addItem("stories", {
        id: makeId("story"),
        ...form,
      });
      addNotification(`Impact story "${form.title}" added.`, "success");
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Impact Stories"
        description="Share the lives your work has changed."
        action={
          <Button
            type="button"
            data-ocid="stories.add_button"
            onClick={openAdd}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add story
          </Button>
        }
      />

      {data.stories.length === 0 ? (
        <EmptyState
          title="No stories yet"
          description="Add your first impact story to share the change you're making."
          action={
            <Button
              type="button"
              data-ocid="stories.add_button"
              onClick={openAdd}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add story
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {data.stories.map((story, i) => (
            <Card key={story.id} className="shadow-card">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-semibold">
                      {story.title}
                    </p>
                    {story.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {story.name} · {story.category} · {story.date}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm">{story.excerpt}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-ocid={`stories.edit_button.${i + 1}`}
                    onClick={() => openEdit(story)}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    data-ocid={`stories.delete_button.${i + 1}`}
                    onClick={() => {
                      deleteItem("stories", story.id);
                      addNotification(
                        `Impact story "${story.title}" deleted.`,
                        "warning",
                      );
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit impact story" : "Add impact story"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this story."
                : "Share a new story of impact."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Name">
              <Input
                data-ocid="stories.name_input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Asha"
              />
            </Field>
            <Field label="Title">
              <Input
                data-ocid="stories.title_input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. From the margins to the classroom"
              />
            </Field>
            <Field label="Category">
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger
                  data-ocid="stories.category_select"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Education", "Health", "Protection", "Livelihood"].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date">
              <Input
                type="date"
                data-ocid="stories.date_input"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
            <Field label="Excerpt">
              <Textarea
                data-ocid="stories.excerpt_input"
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="A short summary shown on cards."
              />
            </Field>
            <Field label="Content">
              <Textarea
                data-ocid="stories.content_input"
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="The full story."
                className="min-h-28"
              />
            </Field>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <Label htmlFor="story-featured">Feature on homepage</Label>
              <Switch
                id="story-featured"
                data-ocid="stories.featured_toggle"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="stories.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="stories.save_button"
              onClick={submit}
              disabled={!form.name.trim() || !form.title.trim()}
            >
              {editing ? "Save changes" : "Add story"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Programs ------------------------------ */

interface ProgramFormState {
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  impact: string;
  beneficiaries: number;
  status: "active" | "paused";
}

const EMPTY_PROGRAM: ProgramFormState = {
  title: "",
  titleHi: "",
  description: "",
  descriptionHi: "",
  icon: "BookOpen",
  impact: "",
  beneficiaries: 0,
  status: "active",
};

const PROGRAM_ICONS = ["BookOpen", "HeartPulse", "ShieldCheck", "Sprout"];

function ProgramsSection() {
  const { data, addItem, updateItem, deleteItem, addNotification } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState<ProgramFormState>(EMPTY_PROGRAM);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_PROGRAM);
    setOpen(true);
  };

  const openEdit = (program: Program) => {
    setEditing(program);
    setForm({
      title: program.title,
      titleHi: program.titleHi,
      description: program.description,
      descriptionHi: program.descriptionHi,
      icon: program.icon,
      impact: program.impact,
      beneficiaries: program.beneficiaries,
      status: program.status,
    });
    setOpen(true);
  };

  const set = <K extends keyof ProgramFormState>(
    key: K,
    value: ProgramFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateItem("programs", editing.id, form);
      addNotification(`Program "${form.title}" updated.`, "success");
    } else {
      addItem("programs", { id: makeId("program"), ...form });
      addNotification(`Program "${form.title}" added.`, "success");
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Programs"
        description="Manage the programs your organisation runs."
        action={
          <Button
            type="button"
            data-ocid="programs.add_button"
            onClick={openAdd}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add program
          </Button>
        }
      />

      {data.programs.length === 0 ? (
        <EmptyState
          title="No programs yet"
          description="Add a program to show the work you do."
          action={
            <Button
              type="button"
              data-ocid="programs.add_button"
              onClick={openAdd}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add program
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {data.programs.map((program, i) => (
            <Card key={program.id} className="shadow-card">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-semibold">
                      {program.title}
                    </p>
                    <Badge
                      variant={
                        program.status === "active" ? "default" : "secondary"
                      }
                    >
                      {program.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {program.impact} ·{" "}
                    {program.beneficiaries.toLocaleString("en-IN")}{" "}
                    beneficiaries
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm">
                    {program.description}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-ocid={`programs.edit_button.${i + 1}`}
                    onClick={() => openEdit(program)}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    data-ocid={`programs.delete_button.${i + 1}`}
                    onClick={() => {
                      deleteItem("programs", program.id);
                      addNotification(
                        `Program "${program.title}" deleted.`,
                        "warning",
                      );
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit program" : "Add program"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this program."
                : "Add a new program."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Title (English)">
              <Input
                data-ocid="programs.title_input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Education for Every Child"
              />
            </Field>
            <Field label="Title (Hindi)">
              <Input
                data-ocid="programs.title_hi_input"
                value={form.titleHi}
                onChange={(e) => set("titleHi", e.target.value)}
                placeholder="e.g. हर बच्चे के लिए शिक्षा"
              />
            </Field>
            <Field label="Description (English)">
              <Textarea
                data-ocid="programs.description_input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <Field label="Description (Hindi)">
              <Textarea
                data-ocid="programs.description_hi_input"
                value={form.descriptionHi}
                onChange={(e) => set("descriptionHi", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Icon">
                <Select value={form.icon} onValueChange={(v) => set("icon", v)}>
                  <SelectTrigger
                    data-ocid="programs.icon_select"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAM_ICONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v as "active" | "paused")}
                >
                  <SelectTrigger
                    data-ocid="programs.status_select"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Impact statement">
              <Input
                data-ocid="programs.impact_input"
                value={form.impact}
                onChange={(e) => set("impact", e.target.value)}
                placeholder="e.g. 1,200+ children supported in school"
              />
            </Field>
            <Field label="Beneficiaries">
              <Input
                type="number"
                data-ocid="programs.beneficiaries_input"
                value={form.beneficiaries}
                onChange={(e) => set("beneficiaries", Number(e.target.value))}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="programs.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="programs.save_button"
              onClick={submit}
              disabled={!form.title.trim()}
            >
              {editing ? "Save changes" : "Add program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Volunteers ------------------------------ */

interface RoleFormState {
  title: string;
  description: string;
  commitment: string;
  location: string;
  open: boolean;
}

const EMPTY_ROLE: RoleFormState = {
  title: "",
  description: "",
  commitment: "",
  location: "",
  open: true,
};

function VolunteersSection() {
  const { data, addItem, updateItem, deleteItem, addNotification } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VolunteerRole | null>(null);
  const [form, setForm] = useState<RoleFormState>(EMPTY_ROLE);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_ROLE);
    setOpen(true);
  };

  const openEdit = (role: VolunteerRole) => {
    setEditing(role);
    setForm({
      title: role.title,
      description: role.description,
      commitment: role.commitment,
      location: role.location,
      open: role.open,
    });
    setOpen(true);
  };

  const set = <K extends keyof RoleFormState>(
    key: K,
    value: RoleFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateItem("volunteerRoles", editing.id, form);
      addNotification(`Volunteer role "${form.title}" updated.`, "success");
    } else {
      addItem("volunteerRoles", { id: makeId("role"), ...form });
      addNotification(`Volunteer role "${form.title}" added.`, "success");
    }
    setOpen(false);
  };

  const roleTitle = (roleId: string) =>
    data.volunteerRoles.find((r) => r.id === roleId)?.title ?? "Unknown role";

  const statusBadge = (status: VolunteerApplication["status"]) => {
    if (status === "approved")
      return <Badge className="bg-success text-white">Approved</Badge>;
    if (status === "rejected")
      return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SectionHeader
          title="Volunteer Roles"
          description="Manage the roles volunteers can apply for."
          action={
            <Button
              type="button"
              data-ocid="roles.add_button"
              onClick={openAdd}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add role
            </Button>
          }
        />
        {data.volunteerRoles.length === 0 ? (
          <EmptyState
            title="No volunteer roles"
            description="Add a role to start receiving applications."
            action={
              <Button
                type="button"
                data-ocid="roles.add_button"
                onClick={openAdd}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add role
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {data.volunteerRoles.map((role, i) => (
              <Card key={role.id} className="shadow-card">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-semibold">
                        {role.title}
                      </p>
                      <Badge variant={role.open ? "default" : "secondary"}>
                        {role.open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {role.commitment} · {role.location}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm">
                      {role.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-ocid={`roles.edit_button.${i + 1}`}
                      onClick={() => openEdit(role)}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      data-ocid={`roles.delete_button.${i + 1}`}
                      onClick={() => {
                        deleteItem("volunteerRoles", role.id);
                        addNotification(
                          `Volunteer role "${role.title}" deleted.`,
                          "warning",
                        );
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader
          title="Applications"
          description="Review and update the status of volunteer applications."
          action={null}
        />
        {data.volunteerApplications.length === 0 ? (
          <EmptyState
            title="No applications"
            description="Applications from volunteers will appear here."
          />
        ) : (
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.volunteerApplications.map((app, i) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.email}
                        </p>
                      </TableCell>
                      <TableCell>{roleTitle(app.roleId)}</TableCell>
                      <TableCell>{app.date}</TableCell>
                      <TableCell>{statusBadge(app.status)}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={app.status}
                          onValueChange={(v) => {
                            updateItem("volunteerApplications", app.id, {
                              status: v as VolunteerApplication["status"],
                            });
                            addNotification(
                              `Application from ${app.name} marked ${v}.`,
                              "info",
                            );
                          }}
                        >
                          <SelectTrigger
                            data-ocid={`applications.status_select.${i + 1}`}
                            className="ml-auto w-32"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit volunteer role" : "Add volunteer role"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this role."
                : "Add a new volunteer role."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Title">
              <Input
                data-ocid="roles.title_input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. After-school Tutor"
              />
            </Field>
            <Field label="Description">
              <Textarea
                data-ocid="roles.description_input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Commitment">
                <Input
                  data-ocid="roles.commitment_input"
                  value={form.commitment}
                  onChange={(e) => set("commitment", e.target.value)}
                  placeholder="e.g. 4 hours / week"
                />
              </Field>
              <Field label="Location">
                <Input
                  data-ocid="roles.location_input"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Delhi & Jaipur"
                />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <Label htmlFor="role-open">Accepting applications</Label>
              <Switch
                id="role-open"
                data-ocid="roles.open_toggle"
                checked={form.open}
                onCheckedChange={(v) => set("open", v)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="roles.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="roles.save_button"
              onClick={submit}
              disabled={!form.title.trim()}
            >
              {editing ? "Save changes" : "Add role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Events ------------------------------ */

interface EventFormState {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
}

const EMPTY_EVENT: EventFormState = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  time: "",
  location: "",
  category: "Fundraiser",
  capacity: 100,
};

function EventsSection() {
  const { data, addItem, updateItem, deleteItem, addNotification } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState<EventFormState>(EMPTY_EVENT);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_EVENT);
    setOpen(true);
  };

  const openEdit = (event: EventItem) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      capacity: event.capacity,
    });
    setOpen(true);
  };

  const set = <K extends keyof EventFormState>(
    key: K,
    value: EventFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateItem("events", editing.id, form);
      addNotification(`Event "${form.title}" updated.`, "success");
    } else {
      addItem("events", { id: makeId("event"), ...form });
      addNotification(`Event "${form.title}" added.`, "success");
    }
    setOpen(false);
  };

  const eventTitle = (eventId: string) =>
    data.events.find((e) => e.id === eventId)?.title ?? "Unknown event";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SectionHeader
          title="Events"
          description="Manage the events you host."
          action={
            <Button
              type="button"
              data-ocid="events.add_button"
              onClick={openAdd}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add event
            </Button>
          }
        />
        {data.events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Add an event to start collecting registrations."
            action={
              <Button
                type="button"
                data-ocid="events.add_button"
                onClick={openAdd}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add event
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {data.events.map((event, i) => (
              <Card key={event.id} className="shadow-card">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-semibold">
                        {event.title}
                      </p>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.date} · {event.time} · {event.location}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-ocid={`events.edit_button.${i + 1}`}
                      onClick={() => openEdit(event)}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      data-ocid={`events.delete_button.${i + 1}`}
                      onClick={() => {
                        deleteItem("events", event.id);
                        addNotification(
                          `Event "${event.title}" deleted.`,
                          "warning",
                        );
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader
          title="Registrations"
          description="People who have registered for your events."
          action={null}
        />
        {data.eventRegistrations.length === 0 ? (
          <EmptyState
            title="No registrations"
            description="Registrations from visitors will appear here."
          />
        ) : (
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.eventRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>{eventTitle(reg.eventId)}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit event" : "Add event"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this event."
                : "Add a new event."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Title">
              <Input
                data-ocid="events.title_input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Annual Fundraising Gala"
              />
            </Field>
            <Field label="Description">
              <Textarea
                data-ocid="events.description_input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <Input
                  type="date"
                  data-ocid="events.date_input"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>
              <Field label="Time">
                <Input
                  data-ocid="events.time_input"
                  value={form.time}
                  onChange={(e) => set("time", e.target.value)}
                  placeholder="e.g. 6:00 PM"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location">
                <Input
                  data-ocid="events.location_input"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. New Delhi"
                />
              </Field>
              <Field label="Category">
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v)}
                >
                  <SelectTrigger
                    data-ocid="events.category_select"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Fundraiser", "Health", "Volunteer", "Community"].map(
                      (c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Capacity">
              <Input
                type="number"
                data-ocid="events.capacity_input"
                value={form.capacity}
                onChange={(e) => set("capacity", Number(e.target.value))}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="events.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="events.save_button"
              onClick={submit}
              disabled={!form.title.trim()}
            >
              {editing ? "Save changes" : "Add event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Partners ------------------------------ */

interface PartnerFormState {
  name: string;
  description: string;
  website: string;
  tier: Partner["tier"];
}

const EMPTY_PARTNER: PartnerFormState = {
  name: "",
  description: "",
  website: "",
  tier: "gold",
};

function PartnersSection() {
  const { data, addItem, updateItem, deleteItem, addNotification } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState<PartnerFormState>(EMPTY_PARTNER);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_PARTNER);
    setOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setEditing(partner);
    setForm({
      name: partner.name,
      description: partner.description,
      website: partner.website,
      tier: partner.tier,
    });
    setOpen(true);
  };

  const set = <K extends keyof PartnerFormState>(
    key: K,
    value: PartnerFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateItem("partners", editing.id, form);
      addNotification(`Partner "${form.name}" updated.`, "success");
    } else {
      addItem("partners", {
        id: makeId("partner"),
        ...form,
      });
      addNotification(`Partner "${form.name}" added.`, "success");
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Partners"
        description="Manage the organisations you work with."
        action={
          <Button
            type="button"
            data-ocid="partners.add_button"
            onClick={openAdd}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add partner
          </Button>
        }
      />

      {data.partners.length === 0 ? (
        <EmptyState
          title="No partners yet"
          description="Add a partner to show who supports your work."
          action={
            <Button
              type="button"
              data-ocid="partners.add_button"
              onClick={openAdd}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add partner
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {data.partners.map((partner, i) => (
            <Card key={partner.id} className="shadow-card">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-semibold">
                      {partner.name}
                    </p>
                    <Badge variant="secondary">{partner.tier}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {partner.website}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm">
                    {partner.description}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-ocid={`partners.edit_button.${i + 1}`}
                    onClick={() => openEdit(partner)}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    data-ocid={`partners.delete_button.${i + 1}`}
                    onClick={() => {
                      deleteItem("partners", partner.id);
                      addNotification(
                        `Partner "${partner.name}" deleted.`,
                        "warning",
                      );
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit partner" : "Add partner"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this partner."
                : "Add a new partner."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Name">
              <Input
                data-ocid="partners.name_input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Sunrise Foundation"
              />
            </Field>
            <Field label="Description">
              <Textarea
                data-ocid="partners.description_input"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            <Field label="Website">
              <Input
                data-ocid="partners.website_input"
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://example.com"
              />
            </Field>
            <Field label="Tier">
              <Select
                value={form.tier}
                onValueChange={(v) => set("tier", v as Partner["tier"])}
              >
                <SelectTrigger
                  data-ocid="partners.tier_select"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="partners.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="partners.save_button"
              onClick={submit}
              disabled={!form.name.trim()}
            >
              {editing ? "Save changes" : "Add partner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Financial Reports ------------------------------ */

interface ReportFormState {
  year: number;
  title: string;
  totalIncome: number;
  totalExpense: number;
  published: boolean;
}

const EMPTY_REPORT: ReportFormState = {
  year: new Date().getFullYear(),
  title: "",
  totalIncome: 0,
  totalExpense: 0,
  published: true,
};

function ReportsSection() {
  const { data, addItem, updateItem, deleteItem, addNotification } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialReport | null>(null);
  const [form, setForm] = useState<ReportFormState>(EMPTY_REPORT);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_REPORT);
    setOpen(true);
  };

  const openEdit = (report: FinancialReport) => {
    setEditing(report);
    setForm({
      year: report.year,
      title: report.title,
      totalIncome: report.totalIncome,
      totalExpense: report.totalExpense,
      published: report.published,
    });
    setOpen(true);
  };

  const set = <K extends keyof ReportFormState>(
    key: K,
    value: ReportFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateItem("financialReports", editing.id, form);
      addNotification(`Report "${form.title}" updated.`, "success");
    } else {
      addItem("financialReports", {
        id: makeId("report"),
        ...form,
      });
      addNotification(`Report "${form.title}" added.`, "success");
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Financial Reports"
        description="Manage the annual reports shown on your transparency page."
        action={
          <Button
            type="button"
            data-ocid="reports.add_button"
            onClick={openAdd}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add report
          </Button>
        }
      />

      {data.financialReports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Add a financial report to share your transparency."
          action={
            <Button
              type="button"
              data-ocid="reports.add_button"
              onClick={openAdd}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add report
            </Button>
          }
        />
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Income</TableHead>
                  <TableHead className="text-right">Expense</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.financialReports.map((report, i) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.title}
                    </TableCell>
                    <TableCell>{report.year}</TableCell>
                    <TableCell className="text-right">
                      ₹{report.totalIncome.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{report.totalExpense.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={report.published ? "default" : "secondary"}
                      >
                        {report.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          data-ocid={`reports.edit_button.${i + 1}`}
                          onClick={() => openEdit(report)}
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          data-ocid={`reports.delete_button.${i + 1}`}
                          onClick={() => {
                            deleteItem("financialReports", report.id);
                            addNotification(
                              `Report "${report.title}" deleted.`,
                              "warning",
                            );
                          }}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit report" : "Add report"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this report."
                : "Add a new financial report."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Title">
              <Input
                data-ocid="reports.title_input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Annual Report 2026"
              />
            </Field>
            <Field label="Year">
              <Input
                type="number"
                data-ocid="reports.year_input"
                value={form.year}
                onChange={(e) => set("year", Number(e.target.value))}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Total income (₹)">
                <Input
                  type="number"
                  data-ocid="reports.income_input"
                  value={form.totalIncome}
                  onChange={(e) => set("totalIncome", Number(e.target.value))}
                />
              </Field>
              <Field label="Total expense (₹)">
                <Input
                  type="number"
                  data-ocid="reports.expense_input"
                  value={form.totalExpense}
                  onChange={(e) => set("totalExpense", Number(e.target.value))}
                />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <Label htmlFor="report-published">Published on site</Label>
              <Switch
                id="report-published"
                data-ocid="reports.published_toggle"
                checked={form.published}
                onCheckedChange={(v) => set("published", v)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-ocid="reports.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="reports.save_button"
              onClick={submit}
              disabled={!form.title.trim()}
            >
              {editing ? "Save changes" : "Add report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------ Pages ------------------------------ */

function PagesSection() {
  const { data, updateItem, addNotification } = useData();
  const [draft, setDraft] = useState<
    Record<string, { en: string; hi: string }>
  >(() =>
    Object.fromEntries(
      data.pageContent.map((pc) => [pc.id, { en: pc.valueEn, hi: pc.valueHi }]),
    ),
  );

  const set = (id: string, lang: "en" | "hi", value: string) =>
    setDraft((prev) => ({
      ...prev,
      [id]: { ...prev[id], [lang]: value },
    }));

  const save = (pc: PageContent) => {
    const next = draft[pc.id];
    if (!next) return;
    updateItem("pageContent", pc.id, {
      valueEn: next.en,
      valueHi: next.hi,
    });
    addNotification(`Page text "${pc.label}" updated.`, "success");
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Page Text"
        description="Edit the copy shown on your public pages. Changes save to the data store and reflect on the site live."
        action={null}
      />
      {data.pageContent.length === 0 ? (
        <EmptyState
          title="No page text yet"
          description="Editable page copy will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {data.pageContent.map((pc, i) => (
            <Card key={pc.id} className="shadow-card">
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-base font-semibold">
                    {pc.label}
                  </p>
                  <Badge variant="secondary">{pc.key}</Badge>
                </div>
                <div className="grid gap-3">
                  <Field label="English">
                    <Textarea
                      data-ocid={`pages.en_input.${i + 1}`}
                      value={draft[pc.id]?.en ?? ""}
                      onChange={(e) => set(pc.id, "en", e.target.value)}
                      className="min-h-20"
                    />
                  </Field>
                  <Field label="Hindi">
                    <Textarea
                      data-ocid={`pages.hi_input.${i + 1}`}
                      value={draft[pc.id]?.hi ?? ""}
                      onChange={(e) => set(pc.id, "hi", e.target.value)}
                      className="min-h-20"
                    />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    data-ocid={`pages.save_button.${i + 1}`}
                    onClick={() => save(pc)}
                  >
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Page ------------------------------ */

const TABS = [
  { value: "pages", label: "Pages", icon: FileText },
  { value: "stories", label: "Stories", icon: BookOpen },
  { value: "programs", label: "Programs", icon: HandHeart },
  { value: "volunteers", label: "Volunteers", icon: Users },
  { value: "events", label: "Events", icon: CalendarDays },
  { value: "partners", label: "Partners", icon: FileText },
  { value: "reports", label: "Financial", icon: FileText },
];

export default function AdminContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <Seo
        title="Content | KHW-India Admin"
        description="Manage all site content."
      />
      <div>
        <h1 className="font-display text-2xl font-semibold">Content</h1>
        <p className="text-sm text-muted-foreground">
          Manage page text, stories, programs, volunteers, events, partners, and
          reports.
        </p>
      </div>

      <Tabs defaultValue="stories" data-ocid="content.tabs">
        <TabsList className="h-auto w-full flex-wrap justify-start sm:w-fit">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-ocid={`content.tab.${tab.value}`}
            >
              <tab.icon className="size-4" aria-hidden="true" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pages" className="mt-4">
          <PagesSection />
        </TabsContent>
        <TabsContent value="stories" className="mt-4">
          <StoriesSection />
        </TabsContent>
        <TabsContent value="programs" className="mt-4">
          <ProgramsSection />
        </TabsContent>
        <TabsContent value="volunteers" className="mt-4">
          <VolunteersSection />
        </TabsContent>
        <TabsContent value="events" className="mt-4">
          <EventsSection />
        </TabsContent>
        <TabsContent value="partners" className="mt-4">
          <PartnersSection />
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <ReportsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
