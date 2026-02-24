import { useState, useEffect } from "react";
import { ChevronDown, Zap, AlertTriangle, Check, Info, Sparkles, BookmarkPlus, Trash2, FolderOpen } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  taskTypes,
  gpuMemoryOptions,
  inferenceDevices,
  licenseTypes,
  inferenceFrameworks,
  quantizationOptions,
  deploymentTargets,
  type RecommendationConfig,
  type ModelRecommendation,
} from "@/lib/schemas";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useAuth } from "@/hooks/useAuth";
import { useSavedConfigs, type SavedConfig } from "@/hooks/useSavedConfigs";
import { AuthModal } from "./AuthModal";

const DEFAULT_CONFIG: RecommendationConfig = {
  taskType: "text-generation",
  gpuMemory: "16gb",
  inferenceDevice: "consumer-gpu",
  maxLatency: 100,
  licenseType: "any",
  inferenceFramework: "any",
  quantization: "none",
  deploymentTarget: "local-dev",
  useCaseDescription: "",
};

export function DemoInterface() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [config, setConfig] = useState<RecommendationConfig>(DEFAULT_CONFIG);
  const { mutate, data: recommendations, isPending, isError } = useRecommendations();

  // Auto-run once on mount so the landing page always shows an example
  useEffect(() => {
    mutate(DEFAULT_CONFIG);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetRecommendations = () => mutate(config);

  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-12 scroll-fade-up",
            isVisible && "visible"
          )}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Decision Preview
          </h2>
          <p className="text-lg text-muted-foreground">
            Describe your use case and constraints. Get principled model recommendations.
          </p>
        </div>

        {/* Window container */}
        <div className="max-w-6xl mx-auto border border-border rounded-2xl overflow-hidden bg-card">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
            <span className="w-3 h-3 rounded-full bg-border" />
            <span className="w-3 h-3 rounded-full bg-border" />
            <span className="w-3 h-3 rounded-full bg-border" />
            <span className="ml-2 text-xs font-mono text-muted-foreground/70">
              infralens / decision preview
            </span>
          </div>

          {/* Panel contents */}
          <div className="p-6 md:p-8">
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <InputPanel
                  config={config}
                  setConfig={setConfig}
                  onGetRecommendations={handleGetRecommendations}
                  isPending={isPending}
                />
              </div>
              <div className="lg:col-span-3">
                  <OutputPanel
                    recommendations={recommendations ?? null}
                    isPending={isPending}
                    isError={isError}
                    usedLlmReranking={recommendations?.usedLlmReranking ?? false}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputPanel({
  config,
  setConfig,
  onGetRecommendations,
  isPending,
}: {
  config: RecommendationConfig;
  setConfig: React.Dispatch<React.SetStateAction<RecommendationConfig>>;
  onGetRecommendations: () => void;
  isPending: boolean;
}) {
  const { user } = useAuth();
  const { configs, saveConfig, isSaving, deleteConfig } = useSavedConfigs();
  const [authOpen, setAuthOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleLoadConfig = (saved: SavedConfig) => {
    setConfig({
      taskType: saved.task_type,
      gpuMemory: saved.gpu_memory,
      inferenceDevice: saved.inference_device,
      maxLatency: saved.max_latency,
      licenseType: saved.license_type,
      inferenceFramework: saved.inference_framework,
      quantization: saved.quantization,
      deploymentTarget: saved.deployment_target,
      useCaseDescription: saved.use_case_description,
    });
    setShowSaved(false);
  };

  const handleSave = async () => {
    if (!saveName.trim()) return;
    await saveConfig({ ...config, name: saveName.trim() });
    setSaveName("");
    setShowSaveInput(false);
  };

  return (
    <>
      <div className="glass-card light-interaction p-6 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold">Configure Constraints</h3>
          </div>
          {user && configs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg gap-1.5 text-xs text-muted-foreground"
              onClick={() => setShowSaved((v) => !v)}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Saved
            </Button>
          )}
        </div>

        {/* Saved configs list */}
        {showSaved && configs.length > 0 && (
          <div className="space-y-1.5 pb-2 border-b border-border">
            {configs.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/60 transition-colors"
              >
                <button
                  className="text-sm text-left flex-1 truncate"
                  onClick={() => handleLoadConfig(c)}
                >
                  {c.name}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteConfig(c.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

      {/* Use Case Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          What are you building? <span className="text-xs">(optional, enables AI reasoning)</span>
        </label>
        <Textarea
          value={config.useCaseDescription}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, useCaseDescription: e.target.value }))
          }
          placeholder="e.g. A customer support chatbot that runs on my Mac, summarizes legal documents, or classifies product reviews..."
          className="resize-none rounded-xl bg-secondary/50 border-border text-sm min-h-[80px]"
          maxLength={1000}
        />
      </div>

      {/* Task Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Task Type</label>
        <Select
          value={config.taskType}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, taskType: value }))
          }
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {taskTypes.map((task) => (
              <SelectItem key={task.value} value={task.value} className="rounded-lg">
                {task.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inference Framework */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Inference Framework
        </label>
        <Select
          value={config.inferenceFramework}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, inferenceFramework: value }))
          }
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {inferenceFrameworks.map((fw) => (
              <SelectItem key={fw.value} value={fw.value} className="rounded-lg">
                {fw.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* GPU Memory */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">GPU Memory</label>
        <Select
          value={config.gpuMemory}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, gpuMemory: value }))
          }
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {gpuMemoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="rounded-lg">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inference Device */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Inference Device
        </label>
        <Select
          value={config.inferenceDevice}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, inferenceDevice: value }))
          }
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {inferenceDevices.map((device) => (
              <SelectItem key={device.value} value={device.value} className="rounded-lg">
                {device.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantization */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Quantization</label>
        <Select
          value={config.quantization}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, quantization: value }))
          }
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {quantizationOptions.map((q) => (
              <SelectItem key={q.value} value={q.value} className="rounded-lg">
                {q.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Deployment Target */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Deployment Target
        </label>
        <Select
          value={config.deploymentTarget}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, deploymentTarget: value }))
          }
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {deploymentTargets.map((dt) => (
              <SelectItem key={dt.value} value={dt.value} className="rounded-lg">
                {dt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Latency Requirement */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Max Latency</label>
          <span className="text-sm font-mono text-foreground">{config.maxLatency}ms</span>
        </div>
        <Slider
          value={[config.maxLatency]}
          onValueChange={([value]) =>
            setConfig((prev) => ({ ...prev, maxLatency: value }))
          }
          min={20}
          max={500}
          step={10}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>20ms</span>
          <span>500ms</span>
        </div>
      </div>

      {/* License Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          License Requirements
        </label>
        <Select
          value={config.licenseType}
          onValueChange={(value) =>
            setConfig((prev) => ({ ...prev, licenseType: value }))
          }
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {licenseTypes.map((license) => (
              <SelectItem key={license.value} value={license.value} className="rounded-lg">
                {license.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Get Recommendations — requires sign-in */}
      {user ? (
        <Button
          className="w-full rounded-xl gap-2"
          onClick={onGetRecommendations}
          disabled={isPending}
        >
          <Zap className="w-4 h-4" />
          {isPending ? "Finding models…" : "Get Recommendations"}
        </Button>
      ) : (
        <Button
          className="w-full rounded-xl gap-2"
          onClick={() => setAuthOpen(true)}
        >
          <Zap className="w-4 h-4" />
          Sign in to get recommendations
        </Button>
      )}

      {/* Save Config — logged-in users only */}
      {user && (
        <div className="border-t border-border pt-2">
          {showSaveInput ? (
            <div className="flex gap-2">
              <Input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Config name…"
                className="rounded-xl text-sm h-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") setShowSaveInput(false);
                }}
                autoFocus
              />
              <Button
                size="sm"
                className="rounded-xl shrink-0"
                onClick={handleSave}
                disabled={isSaving || !saveName.trim()}
              >
                {isSaving ? "…" : "Save"}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl gap-2 text-sm"
              onClick={() => setShowSaveInput(true)}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              Save this config
            </Button>
          )}
        </div>
      )}
    </div>

    <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}

function OutputPanel({
  recommendations,
  isPending,
  isError,
  usedLlmReranking,
}: {
  recommendations: (import("@/lib/schemas").RecommendationResult & { usedLlmReranking: boolean }) | null;
  isPending: boolean;
  isError: boolean;
  usedLlmReranking: boolean;
}) {
  if (isError) {
    return (
      <div className="card-depth p-8 text-center text-muted-foreground">
        <p className="text-sm">Could not fetch recommendations. Make sure the server is running.</p>
      </div>
    );
  }

  if (isPending || !recommendations) {
    return (
      <div className="space-y-4">
        <div className="skeleton-shimmer h-52 rounded-2xl" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="skeleton-shimmer h-36 rounded-2xl" />
          <div className="skeleton-shimmer h-36 rounded-2xl" />
        </div>
        <div className="skeleton-shimmer h-28 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {usedLlmReranking && (
        <div className="flex items-center gap-2 text-xs text-primary font-medium px-1">
          <Sparkles className="w-3.5 h-3.5" />
          AI-enhanced recommendations based on your description
        </div>
      )}

      <ModelCard model={recommendations.primary} isPrimary />

      <div className="grid sm:grid-cols-2 gap-4">
        {recommendations.alternatives.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      <WarningCard model={recommendations.warning} />
    </div>
  );
}

function ModelCard({
  model,
  isPrimary = false,
}: {
  model: ModelRecommendation;
  isPrimary?: boolean;
}) {
  const [expanded, setExpanded] = useState(isPrimary);

  return (
    <div
      className={cn(
        "card-depth light-interaction hover-lift-3d overflow-hidden transition-all duration-300",
        isPrimary && "ring-2 ring-primary/20"
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            {isPrimary && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mb-2">
                <Check className="w-3 h-3" />
                Primary Recommendation
              </span>
            )}
            <h4 className="font-semibold">{model.name}</h4>
            <p className="text-sm text-muted-foreground">{model.provider}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{model.score}</div>
            <div className="text-xs text-muted-foreground">score</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <Stat label="Params" value={model.parameters} />
          <Stat label="Memory" value={model.memoryRequired} />
          <Stat label="Latency" value={model.latency} />
          <Stat label="License" value={model.license.split(" ")[0]} />
        </div>

        <p className="text-sm text-muted-foreground mb-3">{model.reasoning}</p>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-muted-foreground hover:text-foreground rounded-xl"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Tradeoffs</span>
          <ChevronDown
            className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")}
          />
        </Button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "max-h-40 mt-3" : "max-h-0"
          )}
        >
          <ul className="space-y-1.5">
            {model.tradeoffs.map((tradeoff, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {tradeoff}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-secondary/50">
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-xs font-medium truncate">{value}</div>
    </div>
  );
}

function WarningCard({ model }: { model: ModelRecommendation }) {
  return (
    <div className="card-depth border-destructive/30 bg-destructive/5 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-destructive">Avoid</h4>
              <span className="text-sm text-muted-foreground">{model.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{model.reasoning}</p>
            <div className="flex flex-wrap gap-2">
              {model.tradeoffs.map((issue, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-destructive/10 text-xs text-destructive/80"
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
