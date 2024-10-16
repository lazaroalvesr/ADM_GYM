export function formatDate(dateString: Date, includeTime: boolean = false): string {
    const dateObject = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'America/Sao_Paulo', 
        hour12: false 
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    }

    const formatter = new Intl.DateTimeFormat('pt-BR', options);

    return formatter.format(dateObject);
}
