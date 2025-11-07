"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogTitle } from "@radix-ui/react-dialog";

interface LocationResult {
  name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

export default function SearchComponent() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [options, setOptions] = useState<LocationResult[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (inputValue && inputValue.length > 1) {
      const fetchLocations = async () => {
        try {
          const response = await fetch(
            `/api/geocoding?name=${encodeURIComponent(
              inputValue
            )}&count=5&language=de`
          );
          const data = await response.json();
          if (data.results) {
            const uniqueResults = data.results.filter(
              (item: LocationResult, index: number, self: LocationResult[]) =>
                index ===
                self.findIndex(
                  (t) => t.name === item.name && t.country === item.country
                )
            );
            setOptions(uniqueResults || []);
          } else {
            setOptions([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setOptions([]);
        }
      };
      fetchLocations();
    }
  }, [inputValue]);

  const getFlagUrl = (countryCode: string) => {
    return `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;
  };

  const handleLocationSelect = (location: LocationResult) => {
    router.push(`/weather?lat=${location.latitude}&lon=${location.longitude}`);
    setOpen(false);
    setInputValue("");
    setOptions([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-[200px] md:w-[400px] justify-start gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Standort suchen...</span>
        </Button>
      </DialogTrigger>
      <DialogTitle className="sr-only">Standort suchen</DialogTitle>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 bg-background/95 backdrop-blur-xl border-2">
        <Command shouldFilter={false} className="rounded-lg border-0">
          <div className="flex items-center border-b px-4 p-4">
            <CommandInput
              placeholder="Stadt oder Ort eingeben..."
              value={inputValue}
              onValueChange={setInputValue}
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[400px] p-2">
            <CommandEmpty className="py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <MapPin className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {inputValue.length > 1
                    ? "Keine Orte gefunden"
                    : "Geben Sie mindestens 2 Zeichen ein"}
                </p>
              </div>
            </CommandEmpty>
            {options.length > 0 && (
              <CommandGroup heading="Orte" className="px-2">
                {options.map((option, index) => (
                  <CommandItem
                    key={`${option.name}-${option.country_code}-${index}`}
                    onSelect={() => handleLocationSelect(option)}
                    className="cursor-pointer rounded-md px-4 py-3 aria-selected:bg-sky-100 aria-selected:text-sky-900 hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage
                          src={getFlagUrl(option.country_code)}
                          alt={option.country_code}
                        />
                        <AvatarFallback className="text-xs bg-linear-to-br from-sky-100 to-blue-100">
                          {option.country_code}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-semibold truncate">
                          {option.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {option.admin1 && `${option.admin1}, `}
                          {option.country}
                        </span>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
