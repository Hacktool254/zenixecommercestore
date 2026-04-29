"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Download, Users, TrendingUp, ShoppingBag, Crown, Loader2 } from "lucide-react";
import { format } from "date-fns";

const VIP_THRESHOLD = 50000;

function VIPBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#f5a623] uppercase">
      <Crown className="h-2.5 w-2.5" />
      VIP
    </span>
  );
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const customers = useQuery(api.users.list, search ? { searchTerm: search } : {});

  const exportCSV = () => {
    if (!customers) return;
    const rows = [
      ["Name", "Email", "Phone", "Orders", "Total Spend", "Last Order", "VIP"],
      ...customers.map((c) => [
        c.name ?? "",
        c.email ?? "",
        c.phone ?? "",
        c.orderCount,
        c.totalSpend,
        c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString("en-KE") : "—",
        c.totalSpend >= VIP_THRESHOLD ? "Yes" : "No",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = `customers_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const totalCustomers = customers?.length ?? 0;
  const vipCount = customers?.filter((c) => c.totalSpend >= VIP_THRESHOLD).length ?? 0;
  const totalRevenue = customers?.reduce((s, c) => s + c.totalSpend, 0) ?? 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-[#f5a623]/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[#f5a623]/40" />
            <p className="text-[10px] font-black tracking-[0.4em] text-[#f5a623]/50 uppercase">
              CRM & Analytics
            </p>
          </div>
          <h1 className="text-4xl leading-none font-black tracking-tighter text-white">
            CUSTOMER <span className="font-normal text-[#f5a623] italic">Base</span>
          </h1>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-xl border border-[#f5a623]/20 bg-[#f5a623]/5 px-5 py-3 text-xs font-bold tracking-widest text-[#f5a623] uppercase transition hover:bg-[#f5a623]/10"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#f5a623]/60" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              Total Customers
            </p>
          </div>
          <p className="text-3xl font-black tracking-tighter text-white">{totalCustomers}</p>
        </div>
        <div className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="h-4 w-4 text-[#f5a623]/60" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              VIP Clients
            </p>
          </div>
          <p className="text-3xl font-black tracking-tighter text-[#f5a623]">{vipCount}</p>
        </div>
        <div className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#f5a623]/60" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              Customer Revenue
            </p>
          </div>
          <p className="text-3xl font-black tracking-tighter text-white">
            KES {(totalRevenue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8b92a5]/60" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="h-10 w-full rounded-xl border border-[#f5a623]/10 bg-[#0d1117] pr-4 pl-10 text-sm text-white outline-none placeholder:text-[#8b92a5]/40 focus:border-[#f5a623]/40"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#0d1117]">
        {customers === undefined ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-[#f5a623]" />
          </div>
        ) : customers.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#8b92a5]/40 italic">No customers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f5a623]/10">
                  {["Customer", "Contact", "Orders", "Total Spend", "Last Order", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-[9px] font-black tracking-[0.25em] text-[#8b92a5]/50 uppercase"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5a623]/5">
                {customers.map((customer) => {
                  const isVIP = customer.totalSpend >= VIP_THRESHOLD;
                  return (
                    <tr key={customer._id} className="transition hover:bg-[#f5a623]/[0.02]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5a623]/10">
                            {customer.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={customer.image}
                                alt=""
                                className="h-9 w-9 rounded-xl object-cover"
                              />
                            ) : (
                              <span className="text-xs font-black text-[#f5a623]">
                                {(customer.name ?? "?").charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white">{customer.name ?? "—"}</p>
                            {isVIP && <VIPBadge />}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-white">{customer.email ?? "—"}</p>
                        {customer.phone && (
                          <p className="mt-0.5 text-[10px] tracking-wider text-[#8b92a5]/50 uppercase">
                            {customer.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-3.5 w-3.5 text-[#8b92a5]/40" />
                          <span className="font-bold text-white">{customer.orderCount}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-black text-[#f5a623]">
                        KES {customer.totalSpend.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-xs text-[#8b92a5]/50">
                        {customer.lastOrderAt ? format(customer.lastOrderAt, "MMM d, yyyy") : "—"}
                      </td>
                      <td className="px-5 py-4">
                        {customer.orderCount === 0 ? (
                          <span className="inline-flex rounded-full border border-[#8b92a5]/20 bg-[#1e2435] px-2.5 py-1 text-[9px] font-black tracking-widest text-[#8b92a5] uppercase">
                            New
                          </span>
                        ) : isVIP ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-2.5 py-1 text-[9px] font-black tracking-widest text-[#f5a623] uppercase">
                            <Crown className="h-2.5 w-2.5" />
                            VIP
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black tracking-widest text-emerald-400 uppercase">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
