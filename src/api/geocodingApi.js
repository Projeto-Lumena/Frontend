const GEOCODING_URL =
    import.meta.env.VITE_GEOCODING_BASE_URL ??
    'https://nominatim.openstreetmap.org'

const CACHE_PREFIX = 'reverse-geocode:'

function locationCacheKey(latitude, longitude) {
    return `${Number(latitude).toFixed(4)},${Number(longitude).toFixed(4)}`
}

function readCache(key) {
    try {
        const cached = localStorage.getItem(
            `${CACHE_PREFIX}${key}`
        )

        return cached ? JSON.parse(cached) : null
    } catch {
        return null
    }
}

function writeCache(key, value) {
    try {
        localStorage.setItem(
            `${CACHE_PREFIX}${key}`,
            JSON.stringify(value)
        )
    } catch {
       
    }
}

const geocodingApi = {

    async search(address) {
        const params = new URLSearchParams({
            q: address,
            format: 'jsonv2',
            limit: '1',
            addressdetails: '1'
        })

        const response = await fetch(
            `${GEOCODING_URL}/search?${params}`,
            {
                headers: {
                    Accept:
                        'application/json'
                }
            }
        )

        if (!response.ok) {
            throw new Error(
                `Falha HTTP ${response.status}`
            )
        }

        const results =
            await response.json()

        if (!results.length) {
            return null
        }

        return {
            latitude:
                Number(results[0].lat),

            longitude:
                Number(results[0].lon)
        }
    },

    async reverse(
        latitude,
        longitude
    ) {
        const key =
            locationCacheKey(
                latitude,
                longitude
            )

        const cached =
            readCache(key)

        if (cached) {
            return cached
        }

        const params =
            new URLSearchParams({
                format: 'jsonv2',
                lat: String(latitude),
                lon: String(longitude),
                zoom: '18',
                addressdetails: '1'
            })

        const response =
            await fetch(
                `${GEOCODING_URL}/reverse?${params}`,
                {
                    headers: {
                        Accept:
                            'application/json'
                    }
                }
            )

        if (!response.ok) {
            throw new Error(
                `Falha HTTP ${response.status}`
            )
        }

        const result =
            await response.json()

        const location = {
            label:
                result?.address?.road ||
                result?.address?.pedestrian ||
                result?.address?.path ||
                result?.display_name ||
                'Endereço não identificado',

            displayName:
                result?.display_name ||
                null
        }

        writeCache(
            key,
            location
        )

        return location
    }
}

export default geocodingApi