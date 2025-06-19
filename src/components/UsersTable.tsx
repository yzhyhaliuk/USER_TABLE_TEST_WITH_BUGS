import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store.ts';
import { fetchUsers, setFilter } from '../features/UsersSlice.ts';
import { useEffect, useState } from 'react';
import { FILTER_KEYS } from '../constants/constants.ts';
import classNames from 'classnames';
import styles from './UsersTable.module.scss';
import { Loader } from './Loader.tsx';

export const UsersTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, filters, status } = useSelector((state: RootState) => state.users);
  const [inputErrors, setInputErrors] = useState<Record<keyof typeof filters, boolean>>({
    name: false,
    username: false,
    email: false,
    phone: false,
  });

  const handleInputChange = (field: keyof typeof filters, value: string) => {
    const trimmed = value.trim();

    if (value !== '' && trimmed === '') {
      setInputErrors(prev => ({ ...prev, [field]: true }));
      return;
    }

    setInputErrors(prev => ({ ...prev, [field]: false }));
    dispatch(setFilter({ field, value }));
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.username.toLowerCase().includes(filters.username.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.phone.toLowerCase().includes(filters.phone.toLowerCase())
  );

  const isFiltered = filters.name || filters.username || filters.email || filters.phone;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Users Table</h1>
      <div className={styles.filters}>
        {FILTER_KEYS.map(filter => (
          <div className={styles.filterItem} key={filter}>
            <input
              className={classNames(styles.input, {
                [styles.input__error]: inputErrors[filter],
              })}
              type="text"
              placeholder={`Enter ${filter}`}
              value={filters[filter]}
              onChange={e => handleInputChange(filter, e.target.value)}
              onBlur={() => setInputErrors(prev => ({ ...prev, [filter]: false }))}
            />
            <span className={styles.errorText}>
              {inputErrors[filter] ? 'Spaces won’t help. Try real letters.' : '\u00A0'}
            </span>
          </div>
        ))}
      </div>

      {status === 'loading' ? (
        <Loader />
      ) : filteredUsers.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.empty__text}>Zero matches. Try spelling it better maybe?</p>
          <img src="/empty.svg" alt="Nothing found" className={styles.empty__img} />
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {FILTER_KEYS.map(filter => (
                  <th key={filter} className={styles.table__th}>
                    {filter.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={classNames({ [styles.highlightedRow]: isFiltered })}>
                  {FILTER_KEYS.map(filter => (
                    <td key={filter} className={styles.table__td}>
                      {user[filter]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
