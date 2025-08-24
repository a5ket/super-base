import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { superheroes, superheroImages } from '../src/db/schema'
import path from 'path'
import { config } from 'dotenv'

const env = process.env.NODE_ENV || 'development'
const envFile = path.resolve(process.cwd(), `.env.${env}`)
config({ path: envFile })

const DATABASE_URL = process.env.DATABASE_URL!

const superheroesWithImages = [
    {
        superhero: {
            nickname: 'Thor',
            realName: 'Thor Odinson',
            originDescription: 'Norse god of thunder, wielding the hammer Mjolnir, and a founding Avenger.',
            superpowers: 'Super strength, Weather manipulation, Flight',
            catchPhrase: 'For Asgard!'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/1/17/Thor_by_Olivier_Coipel.png',
            caption: 'Thor (Marvel Comics)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Iron Man',
            realName: 'Tony Stark',
            originDescription: 'Genius billionaire in a powered armor suit, founding member of the Avengers.',
            superpowers: 'Powered armor suit, Genius-level intellect, Energy projection',
            catchPhrase: 'I am Iron Man.'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28circa_2018%29.png',
            caption: 'Iron Man Bleeding Edge armor',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Captain America',
            realName: 'Steve Rogers',
            originDescription: 'Super soldier fighting for justice and freedom since World War II.',
            superpowers: 'Enhanced strength, Agility, Leadership',
            catchPhrase: 'I can do this all day.'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/b/bf/CaptainAmericaHughes.jpg',
            caption: 'Captain America comic cover',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Black Panther',
            realName: 'Challa',
            originDescription: 'King of Wakanda, protector of his nation with enhanced senses and agility.',
            superpowers: 'Enhanced strength, Agility, Vibranium suit',
            catchPhrase: 'Wakanda Forever!'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Black_Panther_OS_Vol_1_2.png',
            caption: 'Black Panther (Marvel Comics)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Spider-Man',
            realName: 'Peter Parker',
            originDescription: 'Friendly neighborhood Spider-Man with spider-like powers.',
            superpowers: 'Wall-crawling, Spider-sense, Super strength, Agility',
            catchPhrase: 'With great power comes great responsibility.'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider-Man_Vol_1_129-1.png',
            caption: 'Spider-Man Amazing Fantasy cover',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Hulk',
            realName: 'Bruce Banner',
            originDescription: 'Scientist transformed into a green powerhouse by gamma radiation.',
            superpowers: 'Super strength, Healing factor, Rage empowerment',
            catchPhrase: 'HULK SMASH!'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/a/aa/Hulk_%28circa_2019%29.png',
            caption: 'Hulk (Marvel Comics)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Doctor Strange',
            realName: 'Stephen Strange',
            originDescription: 'Former neurosurgeon turned Sorcerer Supreme, protector of Earth from mystical threats.',
            superpowers: 'Sorcery, Astral projection, Dimensional travel',
            catchPhrase: 'By the Hoary Hosts of Hoggoth!'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/4/4f/Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg',
            caption: 'Doctor Strange (poster)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Scarlet Witch',
            realName: 'Wanda Maximoff',
            originDescription: 'Mutant with powerful reality-warping abilities.',
            superpowers: 'Chaos magic, Telekinesis, Reality warping',
            catchPhrase: 'No more mutants.'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/7/73/ScarletWitch.jpg',
            caption: 'Scarlet Witch (comics)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Vision',
            realName: 'Vision',
            originDescription: 'Android with synthetic vibranium body, created by Ultron and reprogrammed by the Avengers.',
            superpowers: 'Density control, Super strength, Energy projection',
            catchPhrase: 'Even an android can cry.'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/e/ea/Avengers_Vol_4_24.1.jpg',
            caption: 'Vision (animated)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Ant-Man',
            realName: 'Scott Lang',
            originDescription: 'Ex-con turned Avenger, wielder of the Pym Particles allowing him to shrink or grow.',
            superpowers: 'Size manipulation, Communication with insects',
            catchPhrase: 'Pick on someone your own size!'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Irredeemable_Ant-Man_Vol_1_5_Textless.jpg',
            caption: 'Ant-Man (film poster)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Wasp',
            realName: 'Hope van Dyne',
            originDescription: 'Daughter of Hank Pym and Janet van Dyne, partner of Ant-Man.',
            superpowers: 'Size manipulation, Flight, Bio-electric stings',
            catchPhrase: 'The stinger is ready.'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/c/c0/AVEN071.jpg',
            caption: 'The Wasp (Marvel Comics)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Hawkeye',
            realName: 'Clint Barton',
            originDescription: 'Master archer and founding member of the Avengers.',
            superpowers: 'Expert marksman, Martial arts, Acrobatics',
            catchPhrase: "Just can't miss."
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/9/99/Hawkeye_%28Clinton_Barton%29.png',
            caption: 'Hawkeye (Marvel Comics)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Black Widow',
            realName: 'Natasha Romanoff',
            originDescription: 'Former Russian spy turned Avenger.',
            superpowers: 'Espionage, Martial arts, Agility',
            catchPhrase: 'Nothing lasts forever.'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Black_Widow_1.png',
            caption: 'Black Widow (poster)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Falcon',
            realName: 'Sam Wilson',
            originDescription: 'Airborne Avenger using mechanical wings and advanced combat skills.',
            superpowers: 'Flight (via wings), Martial arts',
            catchPhrase: 'On your left!'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/2/2e/TheFalcon.jpg',
            caption: 'Falcon (Marvel Comics)',
            isPrimary: true
        }
    },
    {
        superhero: {
            nickname: 'Captain Marvel',
            realName: 'Carol Danvers',
            originDescription: 'Former Air Force pilot turned cosmic Avenger.',
            superpowers: 'Super strength, Flight, Energy absorption',
            catchPhrase: 'Higher, further, faster!'
        },
        image: {
            url: 'https://upload.wikimedia.org/wikipedia/en/0/02/Carol_Danvers_-_%28evolution%29.jpg',
            caption: 'Captain Marvel (film poster)',
            isPrimary: true
        }
    }
]

async function seed() {
    const pool = new Pool({
        connectionString: DATABASE_URL,
    })

    const db = drizzle(pool)

    try {
        console.log('Starting seed process...')

        await db.transaction(async (tx) => {
            for (const item of superheroesWithImages) {
                const [insertedHero] = await tx.insert(superheroes).values(item.superhero).returning()

                await tx.insert(superheroImages).values({
                    superheroId: insertedHero.id,
                    imageUrl: item.image.url,
                    caption: item.image.caption,
                    isPrimary: item.image.isPrimary
                })
            }
        })

        console.log('Seed completed successfully!')
    } catch (error) {
        console.error('Error seeding database:', error)
    } finally {
        await pool.end()
    }
}

seed()
