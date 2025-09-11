<script lang="ts">
    let t1 = $state("");
    let t2 = $state("");
    let ticketType: "one-way flight" | "return flight" =
        $state("one-way flight");
    let message = $state("");

    function isValidDateString(dateString: string): boolean {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    function isValidReturnFlight(
        departure: string,
        returnDate: string,
    ): boolean {
        if (!isValidDateString(departure) || !isValidDateString(returnDate)) {
            return false;
        }
        const depDate = new Date(departure);
        const retDate = new Date(returnDate);
        return retDate > depDate;
    }

    function getTodayDateString(): string {
        const today = new Date();
        const [month, day, year] = today
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .split("/");

        return `${year}-${month}-${day}`;
    }

    let isValidOrder = $derived.by(() => {
        if (ticketType === "one-way flight") {
            return isValidDateString(t1);
        } else {
            return isValidReturnFlight(t1, t2);
        }
    });
</script>

<div class="flex flex-col gap-4">
    <select class="select" bind:value={ticketType}>
        <option>one-way flight</option>
        <option>return flight</option>
    </select>

    <input
        type="date"
        class={{
            input: true,
            "input-success": isValidDateString(t1),
            "input-error": !isValidDateString(t1),
        }}
        min={getTodayDateString()}
        bind:value={t1}
    />

    <input
        type="date"
        class={{
            input: true,
            "input-success": isValidDateString(t2),
            "input-error":
                !isValidDateString(t2) || isValidReturnFlight(t1, t2),
        }}
        min={t1}
        bind:value={t2}
        disabled={ticketType === "one-way flight"}
    />

    <button
        type="button"
        class="btn"
        disabled={!isValidOrder}
        onclick={() => {
            message = `You have successfully booked a ticket on ${new Date(t1).toLocaleDateString()}${
                ticketType === "return flight"
                    ? `, returning on ${new Date(t2).toLocaleDateString()}`
                    : ""
            }.`;
        }}>Book</button
    >
</div>
<p>{message}</p>
